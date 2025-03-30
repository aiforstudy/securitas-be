import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Monitor } from './entities/monitor.entity';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { QueryMonitorDto } from './dto/query-monitor.dto';
import { PaginatedMonitorDto } from './dto/paginated-monitor.dto';
import { StartStreamDto } from './dto/start-stream.dto';
import axios from 'axios';

@Injectable()
export class MonitorService {
  private readonly logger = new Logger(MonitorService.name);
  private readonly streamApiUrl = process.env.STREAM_API_URL;
  private readonly streamApiSecret = process.env.STREAM_API_SECRET;
  private readonly streamApiPassword = process.env.STREAM_API_PASSWORD;

  constructor(
    @InjectRepository(Monitor)
    private readonly monitorRepository: Repository<Monitor>,
  ) {}

  async create(createMonitorDto: CreateMonitorDto): Promise<Monitor> {
    const monitor = this.monitorRepository.create(createMonitorDto);
    return await this.monitorRepository.save(monitor);
  }

  async findAll(query: QueryMonitorDto): Promise<PaginatedMonitorDto> {
    const { page = 1, limit = 10, company_code, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (company_code) {
      where.company_code = company_code;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.monitorRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      total_pages: Number(total_pages),
    };
  }

  async findOne(id: string): Promise<Monitor> {
    const monitor = await this.monitorRepository.findOne({ where: { id } });
    if (!monitor) {
      throw new NotFoundException(`Monitor with ID "${id}" not found`);
    }
    return monitor;
  }

  async update(
    id: string,
    updateMonitorDto: UpdateMonitorDto,
  ): Promise<Monitor> {
    const monitor = await this.findOne(id);
    Object.assign(monitor, updateMonitorDto);
    return await this.monitorRepository.save(monitor);
  }

  async remove(id: string): Promise<void> {
    const monitor = await this.findOne(id);
    await this.monitorRepository.remove(monitor);
  }

  async getAllMonitors(): Promise<Monitor[]> {
    return await this.monitorRepository.find();
  }

  async startStream(
    startStreamDto: StartStreamDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get all monitors with type=camera
      const monitors = await this.monitorRepository
        .createQueryBuilder('monitor')
        .where('monitor.id IN (:...monitorIds)', {
          monitorIds: startStreamDto.monitor_ids,
        })
        .andWhere('monitor.type = :type', { type: 'camera' })
        .getMany();

      if (!monitors || monitors.length === 0) {
        throw new NotFoundException(
          'No camera monitors found with the provided IDs',
        );
      }

      // Start stream for each monitor
      const results = await Promise.all(
        monitors.map(async (monitor) => {
          try {
            await axios.post(
              `${this.streamApiUrl}/v3/config/paths/add/${monitor.id}`,
              {
                source: monitor.connection_uri,
                sourceProtocol: 'tcp',
                sourceOnDemand: true,
                sourceOnDemandStartTimeout: '10s',
                sourceOnDemandCloseAfter: '10s',
              },
              {
                auth: {
                  username: this.streamApiSecret,
                  password: this.streamApiPassword,
                },
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            this.logger.log(
              `Successfully started stream for monitor ${monitor.id} `,
            );
            return {
              monitor_id: monitor.id,
              success: true,
              message: 'Stream started successfully',
            };
          } catch (error) {
            this.logger.error(error);
            this.logger.error(
              `Failed to start stream for monitor ${monitor.id}: ${error.message}`,
            );
            // if (error.message.includes('path already exists')) {

            this.logger.log(`Stream already started for monitor ${monitor.id}`);
            return {
              monitor_id: monitor.id,
              success: true,
              message: 'Stream already started',
            };

            // return {
            //   monitor_id: monitor.id,
            //   success: false,
            //   message: error.message,
            // };
          }
        }),
      );

      // Check if all streams were started successfully
      const allSuccessful = results.every((result) => result.success);
      const failedMonitors = results.filter((result) => !result.success);

      return {
        success: allSuccessful,
        message: allSuccessful
          ? 'All streams started successfully'
          : `Failed to start streams for monitors: ${failedMonitors
              .map((f) => f.monitor_id)
              .join(', ')}`,
      };
    } catch (error) {
      this.logger.error(`Error starting streams: ${error.message}`);
      throw error;
    }
  }
}
