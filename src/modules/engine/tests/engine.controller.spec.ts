import { Test, TestingModule } from '@nestjs/testing';
import { EngineController } from '../engine.controller';
import { EngineService } from '../engine.service';
import { Engine } from '../entities/engine.entity';
import { CreateEngineDto } from '../dto/create-engine.dto';
import { UpdateEngineDto } from '../dto/update-engine.dto';
import { QueryEngineDto } from '../dto/query-engine.dto';

describe('EngineController', () => {
  let controller: EngineController;
  let service: EngineService;

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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockEngine),
    findAll: jest.fn().mockResolvedValue({
      data: [mockEngine],
      page: 1,
      limit: 10,
      total: 1,
      total_pages: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockEngine),
    update: jest.fn().mockResolvedValue(mockEngine),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngineController],
      providers: [
        {
          provide: EngineService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EngineController>(EngineController);
    service = module.get<EngineService>(EngineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an engine', async () => {
      const createEngineDto: CreateEngineDto = {
        id: 'engine-1',
        name: 'Test Engine',
        sms: true,
        email: true,
        require_approval: true,
        seq_no_format: 'ENG-{YYYYMMDD}-{SEQ}',
        show_on_home: true,
        title: 'Test Engine',
        related_engine: 'engine-2',
        icon: 'https://example.com/icon.png',
        enable: true,
        learn_more_url: 'https://example.com/learn-more',
        weight: 1,
        color: '#FF0000',
      };

      const result = await controller.create(createEngineDto);

      expect(result).toEqual(mockEngine);
      expect(service.create).toHaveBeenCalledWith(createEngineDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated engines', async () => {
      const query: QueryEngineDto = {
        page: 1,
        limit: 10,
      };

      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockEngine],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return an engine by id', async () => {
      const result = await controller.findOne('engine-1');

      expect(result).toEqual(mockEngine);
      expect(service.findOne).toHaveBeenCalledWith('engine-1');
    });
  });

  describe('update', () => {
    it('should update an engine', async () => {
      const updateEngineDto: UpdateEngineDto = {
        name: 'Updated Engine',
        enable: false,
        show_on_home: false,
      };

      const result = await controller.update('engine-1', updateEngineDto);

      expect(result).toEqual(mockEngine);
      expect(service.update).toHaveBeenCalledWith('engine-1', updateEngineDto);
    });
  });

  describe('remove', () => {
    it('should remove an engine', async () => {
      const result = await controller.remove('engine-1');

      expect(result).toEqual(undefined);
      expect(service.remove).toHaveBeenCalledWith('engine-1');
    });
  });
});
