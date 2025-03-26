import { Test, TestingModule } from '@nestjs/testing';
import { MonitorController } from '../monitor.controller';
import { MonitorService } from '../monitor.service';
import { Monitor } from '../entities/monitor.entity';
import { MonitorStatus } from '../enums/monitor-status.enum';
import { CreateMonitorDto } from '../dto/create-monitor.dto';
import { UpdateMonitorDto } from '../dto/update-monitor.dto';
import { QueryMonitorDto } from '../dto/query-monitor.dto';

describe('MonitorController', () => {
  let controller: MonitorController;
  let service: MonitorService;

  const mockMonitor: Monitor = {
    id: 'monitor-1',
    name: 'Test Monitor',
    description: 'Test Monitor Description',
    status: MonitorStatus.CONNECTED,
    company_code: 'TEST',
    rtmp_uri: 'rtmp://test.com/stream',
    play_from_source: false,
    engines: '["engine-1", "engine-2"]',
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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockMonitor),
    findAll: jest.fn().mockResolvedValue({
      data: [mockMonitor],
      page: 1,
      limit: 10,
      total: 1,
      total_pages: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockMonitor),
    update: jest.fn().mockResolvedValue(mockMonitor),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorController],
      providers: [
        {
          provide: MonitorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MonitorController>(MonitorController);
    service = module.get<MonitorService>(MonitorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a monitor', async () => {
      const createMonitorDto: CreateMonitorDto = {
        name: 'Test Monitor',
        description: 'Test Monitor Description',
        status: MonitorStatus.CONNECTED,
        company_code: 'TEST',
        engines: '["engine-1", "engine-2"]',
        graph: '{"nodes": [], "edges": []}',
        location: 'Test Location',
      };

      const result = await controller.create(createMonitorDto);

      expect(result).toEqual(mockMonitor);
      expect(service.create).toHaveBeenCalledWith(createMonitorDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated monitors', async () => {
      const query: QueryMonitorDto = {
        page: 1,
        limit: 10,
      };

      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockMonitor],
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a monitor by id', async () => {
      const result = await controller.findOne('monitor-1');

      expect(result).toEqual(mockMonitor);
      expect(service.findOne).toHaveBeenCalledWith('monitor-1');
    });
  });

  describe('update', () => {
    it('should update a monitor', async () => {
      const updateMonitorDto: UpdateMonitorDto = {
        name: 'Updated Monitor',
        status: MonitorStatus.UNAVAILABLE,
      };

      const result = await controller.update('monitor-1', updateMonitorDto);

      expect(result).toEqual(mockMonitor);
      expect(service.update).toHaveBeenCalledWith(
        'monitor-1',
        updateMonitorDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a monitor', async () => {
      const result = await controller.remove('monitor-1');

      expect(result).toEqual(undefined);
      expect(service.remove).toHaveBeenCalledWith('monitor-1');
    });
  });
});
