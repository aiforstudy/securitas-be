import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetectionService } from '../detection.service';
import { Detection } from '../entities/detection.entity';
import { NotFoundException } from '@nestjs/common';
import { DetectionStatus } from '../enums/detection-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import { Engine } from '../../engine/entities/engine.entity';

describe('DetectionService', () => {
  let service: DetectionService;
  let repository: Repository<Detection>;

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
    approved: 'yes',
    zone: 'zone-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockDetection),
    save: jest.fn().mockResolvedValue(mockDetection),
    findAndCount: jest.fn().mockResolvedValue([[mockDetection], 1]),
    findOne: jest.fn().mockResolvedValue(mockDetection),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetectionService,
        {
          provide: getRepositoryToken(Detection),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DetectionService>(DetectionService);
    repository = module.get<Repository<Detection>>(
      getRepositoryToken(Detection),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a detection', async () => {
      const createDetectionDto = {
        monitor_id: 'monitor-1',
        engine: 'engine-1',
        status: DetectionStatus.PENDING,
        feedback_status: FeedbackStatus.UNMARK,
        alert: false,
        unread: true,
        district: 'District 1',
        suspected_offense: 'Test Offense',
        vehicle_type: 'car',
        license_plate: 'ABC123',
        metadata: {},
        zone: 'zone-1',
      };

      const result = await service.create(createDetectionDto);

      expect(result).toEqual(mockDetection);
      expect(repository.create).toHaveBeenCalledWith(createDetectionDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated detections with default values', async () => {
      const query = {};

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockDetection],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });

    it('should return paginated detections with custom values', async () => {
      const query = {
        page: 2,
        limit: 5,
      };

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockDetection],
        page: 2,
        limit: 5,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a detection by id and timestamp', async () => {
      const result = await service.findOne(
        'detection-1',
        mockDetection.timestamp,
      );

      expect(result).toEqual(mockDetection);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when detection is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.findOne('detection-1', mockDetection.timestamp),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a detection', async () => {
      const updateDetectionDto = {
        status: DetectionStatus.APPROVED,
        feedback_status: FeedbackStatus.APPROVED,
        alert: true,
        unread: false,
      };

      const result = await service.update(
        'detection-1',
        mockDetection.timestamp,
        updateDetectionDto,
      );

      expect(result).toEqual(mockDetection);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when detection is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('detection-1', mockDetection.timestamp, {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a detection', async () => {
      const result = await service.remove(
        'detection-1',
        mockDetection.timestamp,
      );

      expect(result).toEqual(undefined);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when detection is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.remove('detection-1', mockDetection.timestamp),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
