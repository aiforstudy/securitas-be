import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Detection } from './entities/detection.entity';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { QueryDetectionDto } from './dto/query-detection.dto';
import { PaginatedDetectionDto } from './dto/paginated-detection.dto';
import {
  DetectionStatisticsResponseDto,
  DetectionStatisticsDataDto,
  StatisticsDetectionDto,
} from './dto/statistics-detection.dto';
import { v4 as uuidv4 } from 'uuid';
import { MonitorService } from '../monitor/monitor.service';
import { EngineService } from '../engine/engine.service';
import { ZaloService } from '../notification/services/zalo.service';
import { TelegramService } from '../notification/services/telegram.service';
import { SearchDetectionDto } from './dto/search-detection.dto';

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);

  constructor(
    @InjectRepository(Detection)
    private readonly detectionRepository: Repository<Detection>,
    private readonly monitorService: MonitorService,
    private readonly engineService: EngineService,
    private readonly telegramService: TelegramService,
    private readonly zaloService: ZaloService,
  ) {}

  async createIncomingDetection(
    createDetectionDto: CreateDetectionDto,
  ): Promise<Detection> {
    try {
      // Get monitor details to get company_code
      const monitor = await this.monitorService.findOne(
        createDetectionDto.monitor_id,
      );
      if (!monitor) {
        throw new NotFoundException(
          `Monitor not found: ${createDetectionDto.monitor_id}`,
        );
      }

      // Create the detection
      const detection = this.detectionRepository.create({
        ...createDetectionDto,
        id: createDetectionDto.id || uuidv4(),
        approved: 'yes',
      });
      const savedDetection = await this.detectionRepository.save(detection);

      // Send notification via Zalo
      // await this.zaloService.sendDetectionAlert(monitor.company_code, {
      //   id: savedDetection.id,
      //   timestamp: savedDetection.timestamp,
      //   status: savedDetection.status,
      //   engine: savedDetection.engine,
      //   monitor_id: savedDetection.monitor_id,
      //   image_url: savedDetection.image_url,
      //   video_url: savedDetection.video_url,
      // });

      this.telegramService.sendDetectionAlertPure(
        monitor.company_code,
        savedDetection,
      );

      return savedDetection;
    } catch (error) {
      this.logger.error(`Error creating incoming detection: ${error.message}`);
      throw error;
    }
  }

  async findAll(query: QueryDetectionDto): Promise<PaginatedDetectionDto> {
    const {
      monitor_id,
      engine,
      status,
      feedback_status,
      alert,
      unread,
      start_date,
      end_date,
      approved,
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (monitor_id) {
      where.monitor_id = monitor_id;
    }

    if (engine) {
      where.engine = engine;
    }

    if (status) {
      where.status = status;
    }

    if (feedback_status) {
      where.feedback_status = feedback_status;
    }

    if (alert !== undefined) {
      where.alert = alert;
    }

    if (unread !== undefined) {
      where.unread = unread;
    }

    if (start_date && end_date) {
      where.timestamp = Between(start_date, end_date);
    }

    if (approved) {
      where.approved = approved;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await this.detectionRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        timestamp: 'DESC',
      },
      relations: ['monitor', 'engineDetail'],
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      total_pages,
    };
  }

  async findOne(id: string): Promise<Detection> {
    const detection = await this.detectionRepository.findOne({
      where: { id },
      relations: ['monitor', 'engineDetail'],
    });

    if (!detection) {
      throw new NotFoundException(`Detection with ID ${id} not found`);
    }

    return detection;
  }

  async update(
    id: string,
    updateDetectionDto: UpdateDetectionDto,
  ): Promise<Detection> {
    const detection = await this.findOne(id);
    const updatedDetection = Object.assign(detection, updateDetectionDto);
    return this.detectionRepository.save(updatedDetection);
  }

  async remove(id: string): Promise<void> {
    const detection = await this.findOne(id);
    await this.detectionRepository.remove(detection);
  }

  async getStatistics(
    query: StatisticsDetectionDto,
  ): Promise<DetectionStatisticsResponseDto> {
    try {
      // Get all engines for this company
      const engines = await this.engineService.getAllEngines();

      // Get detection counts for each engine and date
      const queryBuilder = this.detectionRepository
        .createQueryBuilder('detection')
        .select('detection.engine_id', 'engine_id')
        .addSelect(
          `DATE_TRUNC('${query.group_by}', detection.timestamp)`,
          'timestamp',
        )
        .addSelect('COUNT(*)', 'count')
        .andWhere('detection.timestamp >= :from', { from: query.from })
        .andWhere('detection.timestamp <= :to', { to: query.to });

      const results = await queryBuilder
        .groupBy('detection.engine_id')
        .addGroupBy('timestamp')
        .getRawMany();

      // Create a map for quick lookup of counts
      const countMap = new Map<string, number>();
      results.forEach((result) => {
        const key = `${result.engine_id}_${result.timestamp}`;
        countMap.set(key, parseInt(result.count));
      });

      // Generate all dates in the range
      const dates: Date[] = [];
      const currentDate = new Date(query.from);
      while (currentDate <= new Date(query.to)) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Generate all combinations of engines and dates
      const data: DetectionStatisticsDataDto[] = dates.map((date) => {
        const timestamp = date.toISOString();
        const engineCounts: Record<string, number> = {};
        engines.forEach((engine) => {
          const key = `${engine.id}_${timestamp}`;
          engineCounts[engine.id] = countMap.get(key) || 0;
        });

        return {
          timestamp,
          ...engineCounts,
        };
      });

      // Create engine details map
      const enginesMap: Record<string, { name: string; description?: string }> =
        {};
      engines.forEach((engine) => {
        enginesMap[engine.id] = {
          name: engine.name,
          description: engine.description,
        };
      });

      return {
        data,
        engines: enginesMap,
      };
    } catch (error) {
      this.logger.error(`Error getting statistics: ${error.message}`);
      throw error;
    }
  }

  async searchDetections(query: SearchDetectionDto): Promise<Detection[]> {
    const {
      monitor_name,
      company_name,
      detection_id,
      status,
      approval_status,
    } = query;

    const queryBuilder = this.detectionRepository
      .createQueryBuilder('detection')
      .leftJoinAndSelect('detection.engine', 'engine')
      .leftJoinAndSelect('detection.monitor', 'monitor')
      .leftJoinAndSelect('detection.engineDetail', 'engineDetail')
      .orderBy('detection.timestamp', 'DESC');

    if (monitor_name) {
      queryBuilder.andWhere('monitor.name LIKE :monitorName', {
        monitorName: `%${monitor_name}%`,
      });
    }

    if (query) {
      queryBuilder.andWhere(
        '(detection.id ILIKE :query OR engine.name ILIKE :query OR monitor.name ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    // if (from) {
    //   queryBuilder.andWhere('detection.timestamp >= :from', { from });
    // }

    // if (to) {
    //   queryBuilder.andWhere('detection.timestamp <= :to', { to });
    // }

    // if (monitor_id) {
    //   queryBuilder.andWhere('detection.monitor_id = :monitor_id', {
    //     monitor_id,
    //   });
    // }

    return await queryBuilder.getMany();
  }
}
