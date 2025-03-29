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
  StatisticsResultDto,
} from './dto/statistics-detection.dto';
import { v4 as uuidv4 } from 'uuid';
import { MonitorService } from '../monitor/monitor.service';
import { EngineService } from '../engine/engine.service';
import { ZaloService } from '../notification/services/zalo.service';
import { TelegramService } from '../notification/services/telegram.service';
import { SearchDetectionDto } from './dto/search-detection.dto';
import { eachDayOfInterval, eachHourOfInterval } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { QueryMonitorDto } from '../monitor/dto/query-monitor.dto';

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

      // Check if detection with the same ID already exists
      if (createDetectionDto.id) {
        const existingDetection = await this.detectionRepository.findOne({
          where: { id: createDetectionDto.id },
        });

        if (existingDetection) {
          this.logger.warn(
            `Detection with ID ${createDetectionDto.id} already exists. Skipping...`,
          );
          return existingDetection;
        }
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
    return await this.detectionRepository.save(updatedDetection);
  }

  async remove(id: string): Promise<void> {
    const detection = await this.findOne(id);
    await this.detectionRepository.remove(detection);
  }

  async getStatistics(
    company_code: string,
    startDate: Date,
    endDate: Date,
    timezone: string = 'UTC',
    groupBy: 'day' | 'hour' = 'day',
  ): Promise<DetectionStatisticsResponseDto> {
    try {
      // Get all monitors for the company
      const query: QueryMonitorDto = {
        company_code,
        page: 1,
        limit: 1000, // Get all monitors
      };
      const monitors = await this.monitorService.findAll(query);

      if (!monitors || monitors.data.length === 0) {
        this.logger.warn(`No monitors found for company ${company_code}`);
        return {
          data: [],
          engines: {},
        };
      }

      // Get monitor IDs
      const monitorIds = monitors.data.map((monitor) => monitor.id);

      // Get all detections for these monitors within the date range
      const detections = await this.detectionRepository
        .createQueryBuilder('detection')
        .where('detection.monitor_id IN (:...monitorIds)', { monitorIds })
        .andWhere('detection.timestamp BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .orderBy('detection.timestamp', 'ASC')
        .getMany();

      // Get unique engines from detections
      const engines = [...new Set(detections.map((d) => d.engine))];

      // Get engine details
      const engineDetails = await Promise.all(
        engines.map(async (engineId) => {
          const engine = await this.engineService.findOne(engineId);
          return {
            id: engineId,
            name: engine?.name || engineId,
            description: engine?.description,
          };
        }),
      );

      // Generate time intervals based on groupBy
      const timeIntervals =
        groupBy === 'day'
          ? eachDayOfInterval({ start: startDate, end: endDate })
          : eachHourOfInterval({ start: startDate, end: endDate });

      // Create a map of detections by timestamp
      const detectionsMap = detections.reduce((acc, detection) => {
        const timestamp = formatInTimeZone(
          detection.timestamp,
          timezone,
          groupBy === 'day' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:00:00',
        );

        if (!acc[timestamp]) {
          acc[timestamp] = {
            timestamp,
            engines: {},
          };
        }

        if (!acc[timestamp].engines[detection.engine]) {
          acc[timestamp].engines[detection.engine] = 0;
        }

        acc[timestamp].engines[detection.engine]++;
        return acc;
      }, {});

      // Generate complete statistics with zero values for missing intervals
      const statistics = timeIntervals.map((date) => {
        const timestamp = formatInTimeZone(
          date,
          timezone,
          groupBy === 'day' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:00:00',
        );

        const existingData = detectionsMap[timestamp] || {
          timestamp,
          engines: {},
        };

        // Fill zero values for all engines
        const enginesWithZeros = engines.reduce((acc, engine) => {
          acc[engine] = existingData.engines[engine] || 0;
          return acc;
        }, {});

        return {
          timestamp,
          ...enginesWithZeros,
        };
      });

      // Convert engine details array to record
      const enginesRecord = engineDetails.reduce((acc, engine) => {
        acc[engine.id] = {
          name: engine.name,
          description: engine.description,
        };
        return acc;
      }, {});

      return {
        data: statistics,
        engines: enginesRecord,
      };
    } catch (error) {
      this.logger.error(`Error getting statistics: ${error.message}`);
      throw error;
    }
  }

  async searchDetections(
    query: SearchDetectionDto,
  ): Promise<PaginatedDetectionDto> {
    const {
      monitor_name,
      detection_id,
      status,
      approved,
      company_code,
      from,
      to,
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.detectionRepository
      .createQueryBuilder('detection')
      .leftJoinAndSelect('detection.monitor', 'monitor')
      .leftJoinAndSelect('detection.engineDetail', 'engineDetail')
      .orderBy('detection.timestamp', 'DESC');

    if (company_code) {
      queryBuilder.andWhere('monitor.company_code = :companyCode', {
        companyCode: company_code,
      });
    }

    if (monitor_name) {
      queryBuilder.andWhere('monitor.name LIKE :monitorName', {
        monitorName: `%${monitor_name}%`,
      });
    }

    if (detection_id) {
      queryBuilder.andWhere('detection.id = :detectionId', {
        detectionId: detection_id,
      });
    }

    if (status) {
      queryBuilder.andWhere('detection.status = :status', {
        status,
      });
    }

    if (approved) {
      queryBuilder.andWhere('detection.approved = :approved', {
        approved,
      });
    }

    if (from) {
      queryBuilder.andWhere('detection.timestamp >= :from', {
        from: new Date(from),
      });
    }

    if (to) {
      queryBuilder.andWhere('detection.timestamp <= :to', {
        to: new Date(to),
      });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total,
      total_pages,
    };
  }
}
