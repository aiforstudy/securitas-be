import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineService } from '../engine.service';
import { Engine } from '../entities/engine.entity';
import { NotFoundException } from '@nestjs/common';

describe('EngineService', () => {
  let service: EngineService;
  let repository: Repository<Engine>;

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

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockEngine),
    save: jest.fn().mockResolvedValue(mockEngine),
    findAndCount: jest.fn().mockResolvedValue([[mockEngine], 1]),
    findOne: jest.fn().mockResolvedValue(mockEngine),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EngineService,
        {
          provide: getRepositoryToken(Engine),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EngineService>(EngineService);
    repository = module.get<Repository<Engine>>(getRepositoryToken(Engine));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an engine', async () => {
      const createEngineDto = {
        id: 'engine-1',
        name: 'Test Engine',
        description: 'Test Engine Description',
        type: 'test',
        version: '1.0.0',
        status: 'active',
      };

      const result = await service.create(createEngineDto);

      expect(result).toEqual(mockEngine);
      expect(repository.create).toHaveBeenCalledWith(createEngineDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated engines with default values', async () => {
      const query = {};

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockEngine],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });

    it('should return paginated engines with custom values', async () => {
      const query = {
        page: 2,
        limit: 5,
      };

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockEngine],
        page: 2,
        limit: 5,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an engine by id', async () => {
      const result = await service.findOne('engine-1');

      expect(result).toEqual(mockEngine);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when engine is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('engine-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an engine', async () => {
      const updateEngineDto = {
        name: 'Updated Engine',
        status: 'inactive',
      };

      const result = await service.update('engine-1', updateEngineDto);

      expect(result).toEqual(mockEngine);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when engine is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('engine-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an engine', async () => {
      const result = await service.remove('engine-1');

      expect(result).toEqual(undefined);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when engine is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('engine-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
