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
  StatisticsDetectionDto,
  DetectionStatisticsResponseDto,
} from './dto/statistics-detection.dto';
import { SearchDetectionDto } from './dto/search-detection.dto';
import { FeedbackStatus } from './enums/feedback-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { MonitorService } from '../monitor/monitor.service';
import { EngineService } from '../engine/engine.service';
import { Engine } from '../engine/entities/engine.entity';
import { TelegramService } from '../notification/services/telegram.service';

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);

  constructor(
    @InjectRepository(Detection)
    private readonly detectionRepository: Repository<Detection>,
    private readonly monitorService: MonitorService,
    private readonly engineService: EngineService,
    private readonly telegramService: TelegramService,
  ) {}

  // async create(createDetectionDto: CreateDetectionDto): Promise<Detection> {
  //   const detection = this.detectionRepository.create(createDetectionDto);
  //   return this.detectionRepository.save(detection);
  // }

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

      // Send Telegram notification
      await this.telegramService.sendDetectionAlert(monitor.company_code, {
        id: savedDetection.id,
        timestamp: savedDetection.timestamp,
        status: savedDetection.status,
        engine: savedDetection.engine,
        monitor_id: savedDetection.monitor_id,
        image_url: savedDetection.image_url,
        video_url: savedDetection.video_url,
      });

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
    const { from, to } = query;

    // Get all unique engines with their details
    const engines = await this.engineService.getAllEngines();

    // Create a map for quick lookup of engine details
    const engineDetailsMap = engines.reduce(
      (acc, engine) => {
        acc[engine.id] = engine;
        return acc;
      },
      {} as Record<string, Engine>,
    );

    // Get all detections within the date range
    const detections = await this.detectionRepository
      .createQueryBuilder('detection')
      .select('detection.engine', 'engine')
      .addSelect('COUNT(*)', 'count')
      .addSelect('DATE(detection.timestamp)', 'date')
      .where('detection.timestamp BETWEEN :from AND :to', { from, to })
      .groupBy('detection.engine')
      .addGroupBy('date')
      .getRawMany();

    // Generate all dates in the range
    const dates: Date[] = [];
    let currentDate = new Date(from);
    while (currentDate <= to) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create a map for quick lookup of detection counts
    const detectionCountsMap = detections.reduce(
      (acc, detection) => {
        const date = detection.date.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][detection.engine] = parseInt(detection.count);
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    // Generate the response data
    const data = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const counts: Record<string, number> = {};

      // Initialize counts for all engines to 0
      engines.forEach((engine) => {
        counts[engine.id] = 0;
      });

      // Update counts with actual detection data if available
      if (detectionCountsMap[dateStr]) {
        Object.assign(counts, detectionCountsMap[dateStr]);
      }

      return {
        timestamp: date,
        ...counts,
      };
    });

    return {
      data,
      engines: engineDetailsMap,
    };
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
      .leftJoinAndSelect('detection.monitor', 'monitor')
      .leftJoinAndSelect('detection.engineDetail', 'engineDetail')
      .orderBy('detection.timestamp', 'DESC');

    if (monitor_name) {
      queryBuilder.andWhere('monitor.name LIKE :monitorName', {
        monitorName: `%${monitor_name}%`,
      });
    }

    if (company_name) {
      queryBuilder.andWhere('monitor.company_code LIKE :companyName', {
        companyName: `%${company_name}%`,
      });
    }

    if (detection_id) {
      queryBuilder.andWhere('detection.id = :detectionId', {
        detectionId: detection_id,
      });
    }

    if (status) {
      queryBuilder.andWhere('detection.status = :status', { status });
    }

    if (approval_status) {
      switch (approval_status) {
        case 'yes':
          queryBuilder.andWhere('detection.feedback_status = :feedbackStatus', {
            feedbackStatus: FeedbackStatus.APPROVED,
          });
          break;
        case 'no':
          queryBuilder.andWhere('detection.feedback_status = :feedbackStatus', {
            feedbackStatus: FeedbackStatus.REJECTED,
          });
          break;
        case 'expired':
          queryBuilder.andWhere('detection.feedback_status = :feedbackStatus', {
            feedbackStatus: FeedbackStatus.UNMARK,
          });
          break;
      }
    }

    return queryBuilder.getMany();
  }
}
