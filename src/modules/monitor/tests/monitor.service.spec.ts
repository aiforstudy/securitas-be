import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonitorService } from '../monitor.service';
import { Monitor } from '../entities/monitor.entity';
import { NotFoundException } from '@nestjs/common';
import { MonitorStatus } from '../enums/monitor-status.enum';

describe('MonitorService', () => {
  let service: MonitorService;
  let repository: Repository<Monitor>;

  const mockMonitor: Monitor = {
    id: 'monitor-1',
    name: 'Test Monitor',
    description: 'Test Monitor Description',
    status: MonitorStatus.CONNECTED,
    company_code: 'TEST',
    rtmp_uri: 'rtmp://test.com/stream',
    play_from_source: false,
    engines: '["engine1", "engine2"]',
    recording: false,
    graph: '{"nodes": [], "edges": []}',
    zone: '{"points": []}',
    type: 'ys',
    device_id: 'device-1',
    machine_id: 'machine-1',
    ip: '0.0.0.0',
    config: '1',
    time_in: new Date(),
    time_out: new Date(),
    socket_id: 'socket-1',
    ys_token: 'token-1',
    user_id: 'user-1',
    tnt: 0,
    fpt: 0,
    conv: 0,
    connection_uri: 'rtsp://test.com/stream',
    sub_connection_uri: 'rtsp://test.com/substream',
    snapshot: 'base64-encoded-image',
    gps_coordinates: '10.123456,106.789012',
    pending_engines: '["engine3", "engine4"]',
    location: 'Test Location',
    snapshot_created_at: new Date(),
    handling_office: 'Office A',
    battery_sync: true,
    battery_threshold: 80,
    require_approval: true,
    rule: '{"conditions": []}',
    last_ping_at: new Date(),
    district: 'District 1',
    dont_require_approval: false,
    seq_no_format: 'YYYYMMDD',
    engines_require_approval: '["engine1", "engine2"]',
    color: '#FF0000',
    sn: 'SN123456',
    camera_identification: 'CAM001',
    platform_device_id: 'PLAT-123',
    expiry_date: new Date(),
    disabled: false,
    latest_disabled_at: new Date(),
    zabbix_host_id: 'zabbix-123',
    created_at: new Date(),
    updated_at: new Date(),
    configuration: {},
    company: null,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockMonitor),
    save: jest.fn().mockResolvedValue(mockMonitor),
    findAndCount: jest.fn().mockResolvedValue([[mockMonitor], 1]),
    findOne: jest.fn().mockResolvedValue(mockMonitor),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorService,
        {
          provide: getRepositoryToken(Monitor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
    repository = module.get<Repository<Monitor>>(getRepositoryToken(Monitor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a monitor', async () => {
      const createMonitorDto = {
        name: 'Test Monitor',
        description: 'Test Monitor Description',
        status: MonitorStatus.CONNECTED,
        company_code: 'TEST',
        engines: '["engine1", "engine2"]',
        graph: '{"nodes": [], "edges": []}',
        location: 'Test Location',
      };

      const result = await service.create(createMonitorDto);

      expect(result).toEqual(mockMonitor);
      expect(repository.create).toHaveBeenCalledWith(createMonitorDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated monitors with default values', async () => {
      const query = {};

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockMonitor],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });

    it('should return paginated monitors with custom values', async () => {
      const query = {
        page: 2,
        limit: 5,
      };

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockMonitor],
        page: 2,
        limit: 5,
        total: 1,
        total_pages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a monitor by id', async () => {
      const result = await service.findOne('monitor-1');

      expect(result).toEqual(mockMonitor);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when monitor is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('monitor-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a monitor', async () => {
      const updateMonitorDto = {
        name: 'Updated Monitor',
        status: MonitorStatus.UNAVAILABLE,
      };

      const result = await service.update('monitor-1', updateMonitorDto);

      expect(result).toEqual(mockMonitor);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when monitor is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('monitor-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a monitor', async () => {
      const result = await service.remove('monitor-1');

      expect(result).toEqual(undefined);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when monitor is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('monitor-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
