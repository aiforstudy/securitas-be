import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
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
import { format, parseISO } from 'date-fns';
import { MonitorService } from '../monitor/monitor.service';
import { EngineService } from '../engine/engine.service';

@Injectable()
export class DetectionService {
  constructor(
    @InjectRepository(Detection)
    private readonly detectionRepository: Repository<Detection>,
    private readonly monitorService: MonitorService,
    private readonly engineService: EngineService,
  ) {}

  async create(createDetectionDto: CreateDetectionDto): Promise<Detection> {
    const detection = this.detectionRepository.create(createDetectionDto);
    return this.detectionRepository.save(detection);
  }

  async createIncomingDetection(
    createDetectionDto: CreateDetectionDto,
  ): Promise<Detection> {
    try {
      if (
        !createDetectionDto.monitor_id ||
        !createDetectionDto.engine ||
        !createDetectionDto.timestamp ||
        !createDetectionDto.zone
      ) {
        throw new BadRequestException('Missing required fields');
      }

      const [monitor, engine] = await Promise.all([
        this.monitorService.findOne(createDetectionDto.monitor_id),
        this.engineService.findOne(createDetectionDto.engine),
      ]);

      if (!monitor || !engine) {
        throw new NotFoundException('Monitor or engine not found');
      }

      const detection = new Detection();
      detection.id = createDetectionDto.id;
      detection.timestamp = createDetectionDto.timestamp;
      detection.monitor_id = createDetectionDto.monitor_id;
      detection.engine = createDetectionDto.engine;
      detection.status = createDetectionDto.status;
      detection.alert = createDetectionDto.alert;
      detection.zone = createDetectionDto.zone;
      detection.approved = 'yes';

      return this.detectionRepository.save(detection);
    } catch (error) {
      throw new BadRequestException(error);
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
      district,
      suspected_offense,
      vehicle_type,
      license_plate,
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

    if (district) {
      where.district = Like(`%${district}%`);
    }

    if (suspected_offense) {
      where.suspected_offense = Like(`%${suspected_offense}%`);
    }

    if (vehicle_type) {
      where.vehicle_type = Like(`%${vehicle_type}%`);
    }

    if (license_plate) {
      where.license_plate = Like(`%${license_plate}%`);
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

  async findOne(id: string, timestamp: Date): Promise<Detection> {
    const detection = await this.detectionRepository.findOne({
      where: { id, timestamp },
      relations: ['monitor', 'engineDetail'],
    });

    if (!detection) {
      throw new NotFoundException(
        `Detection with ID ${id} and timestamp ${timestamp} not found`,
      );
    }

    return detection;
  }

  async update(
    id: string,
    timestamp: Date,
    updateDetectionDto: UpdateDetectionDto,
  ): Promise<Detection> {
    const detection = await this.findOne(id, timestamp);
    const updatedDetection = Object.assign(detection, updateDetectionDto);
    return this.detectionRepository.save(updatedDetection);
  }

  async remove(id: string, timestamp: Date): Promise<void> {
    const detection = await this.findOne(id, timestamp);
    await this.detectionRepository.remove(detection);
  }

  async getStatistics(
    query: StatisticsDetectionDto,
  ): Promise<DetectionStatisticsResponseDto[]> {
    const { from, to, timezone, group_by } = query;

    // Create the SQL query based on grouping
    const timeFormat =
      group_by === 'day'
        ? 'DATE(timestamp)'
        : "DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00')";

    const queryBuilder = this.detectionRepository
      .createQueryBuilder('detection')
      .select('detection.engine', 'engine')
      .addSelect(`${timeFormat}`, 'timestamp')
      .addSelect('COUNT(*)', 'count')
      .where('detection.timestamp BETWEEN :startDate AND :endDate', {
        startDate: from,
        endDate: to,
      })
      .groupBy('detection.engine')
      .addGroupBy('timestamp')
      .orderBy('timestamp', 'ASC')
      .addOrderBy('detection.engine', 'ASC');

    const results = await queryBuilder.getRawMany();

    // Format timestamps according to timezone
    return results.map((result) => ({
      engine: result.engine,
      timestamp: parseISO(result.timestamp),
      count: parseInt(result.count),
    }));
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
