import { Test, TestingModule } from '@nestjs/testing';
import { DetectionController } from '../detection.controller';
import { DetectionService } from '../detection.service';
import { CreateDetectionDto } from '../dto/create-detection.dto';
import { UpdateDetectionDto } from '../dto/update-detection.dto';
import { QueryDetectionDto } from '../dto/query-detection.dto';
import { Detection } from '../entities/detection.entity';
import { DetectionStatus } from '../enums/detection-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import { Engine } from '../../engine/entities/engine.entity';
import { StatisticsDetectionDto } from '../dto/statistics-detection.dto';

describe('DetectionController', () => {
  let controller: DetectionController;
  let service: DetectionService;

  const mockEngine: Engine = {
    id: 'engine-1',
    name: 'Test Engine',
    description: 'Test Engine Description',
    type: 'test',
    version: '1.0.0',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockDetection: Detection = {
    id: 'detection-1',
    timestamp: new Date(),
    monitor_id: 'monitor-1',
    monitor: null,
    engine: 'engine-1',
    engineDetail: mockEngine,
    status: DetectionStatus.PENDING,
    feedback_status: FeedbackStatus.UNMARK,
    alert: false,
    unread: true,
    district: 'District 1',
    suspected_offense: 'Test Offense',
    vehicle_type: 'car',
    license_plate: 'ABC123',
    metadata: {},
    created_at: new Date(),
    updated_at: new Date(),
    approved: 'yes',
    zone: 'zone-1',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockDetection),
    createIncomingDetection: jest.fn().mockResolvedValue(mockDetection),
    findAll: jest.fn().mockResolvedValue({
      data: [mockDetection],
      page: 1,
      limit: 10,
      total: 1,
      total_pages: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockDetection),
    update: jest.fn().mockResolvedValue(mockDetection),
    remove: jest.fn().mockResolvedValue(undefined),
    getStatistics: jest.fn().mockResolvedValue([]),
    searchDetections: jest.fn().mockResolvedValue([mockDetection]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetectionController],
      providers: [
        {
          provide: DetectionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DetectionController>(DetectionController);
    service = module.get<DetectionService>(DetectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a detection', async () => {
      const createDetectionDto: CreateDetectionDto = {
        monitor_id: 'monitor-1',
        engine: 'engine-1',
        zone: 'zone-1',
        status: DetectionStatus.PENDING,
        feedback_status: FeedbackStatus.UNMARK,
        alert: false,
        unread: true,
        district: 'District 1',
        suspected_offense: 'Test Offense',
        vehicle_type: 'car',
        license_plate: 'ABC123',
        metadata: {},
      };

      const result = await controller.create(createDetectionDto);

      expect(result).toEqual(mockDetection);
      expect(service.create).toHaveBeenCalledWith(createDetectionDto);
    });
  });

  describe('createIncomingDetection', () => {
    it('should create an incoming detection', async () => {
      const createDetectionDto: CreateDetectionDto = {
        id: 'detection-1',
        timestamp: new Date(),
        monitor_id: 'monitor-1',
        engine: 'engine-1',
        zone: 'zone-1',
        status: DetectionStatus.PENDING,
        feedback_status: FeedbackStatus.UNMARK,
        alert: false,
        unread: true,
        district: 'District 1',
        suspected_offense: 'Test Offense',
        vehicle_type: 'car',
        license_plate: 'ABC123',
        metadata: {},
      };

      const result =
        await controller.createIncomingDetection(createDetectionDto);

      expect(result).toEqual(mockDetection);
      expect(service.createIncomingDetection).toHaveBeenCalledWith(
        createDetectionDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated detections', async () => {
      const query: QueryDetectionDto = {
        page: 1,
        limit: 10,
      };

      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockDetection],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a detection by id and timestamp', async () => {
      const id = 'detection-1';
      const timestamp = new Date();

      const result = await controller.findOne(id, timestamp);

      expect(result).toEqual(mockDetection);
      expect(service.findOne).toHaveBeenCalledWith(id, timestamp);
    });
  });

  describe('update', () => {
    it('should update a detection', async () => {
      const id = 'detection-1';
      const timestamp = new Date();
      const updateDetectionDto: UpdateDetectionDto = {
        status: DetectionStatus.APPROVED,
        feedback_status: FeedbackStatus.APPROVED,
      };

      const result = await controller.update(id, timestamp, updateDetectionDto);

      expect(result).toEqual(mockDetection);
      expect(service.update).toHaveBeenCalledWith(
        id,
        timestamp,
        updateDetectionDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a detection', async () => {
      const id = 'detection-1';
      const timestamp = new Date();

      const result = await controller.remove(id, timestamp);

      expect(result).toEqual(undefined);
      expect(service.remove).toHaveBeenCalledWith(id, timestamp);
    });
  });

  describe('getStatistics', () => {
    it('should return detection statistics', async () => {
      const query: StatisticsDetectionDto = {
        from: new Date(),
        to: new Date(),
        timezone: 'Asia/Ho_Chi_Minh',
        group_by: 'day' as const,
      };

      const result = await controller.getStatistics(query);

      expect(result).toEqual([]);
      expect(service.getStatistics).toHaveBeenCalledWith(query);
    });
  });

  describe('searchDetections', () => {
    it('should return filtered detections', async () => {
      const query = {
        monitor_name: 'Test Monitor',
        company_name: 'Test Company',
        detection_id: 'detection-1',
        status: DetectionStatus.PENDING,
      };

      const result = await controller.searchDetections(query);

      expect(result).toEqual([mockDetection]);
      expect(service.searchDetections).toHaveBeenCalledWith(query);
    });
  });
});
