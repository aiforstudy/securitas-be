import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { MonitorStatus } from '../enums/monitor-status.enum';

export class CreateMonitorDto {
  @ApiProperty({
    description: 'The company code associated with the monitor',
    example: 'COMP001',
  })
  @IsString()
  company_code: string;

  @ApiProperty({
    description: 'The name of the monitor',
    example: 'Main Entrance Camera',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The RTMP URI for the monitor stream',
    example: 'rtmp://example.com/live/stream1',
  })
  @IsString()
  @IsOptional()
  rtmp_uri?: string;

  @ApiProperty({
    description: 'Whether to play from source',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  play_from_source?: boolean;

  @ApiProperty({
    description: 'The engines configuration as JSON string',
    example: '["engine1", "engine2"]',
  })
  @IsString()
  engines: string;

  @ApiProperty({
    description: 'Whether recording is enabled',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  recording?: boolean;

  @ApiProperty({
    description: 'The graph configuration as JSON string',
    example: '{"nodes": [], "edges": []}',
  })
  @IsString()
  graph: string;

  @ApiProperty({
    description: 'The zone configuration as JSON string',
    example: '{"points": []}',
  })
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiProperty({
    description: 'The type of monitor',
    example: 'ys',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'The device ID',
    example: 'device-123',
  })
  @IsString()
  @IsOptional()
  device_id?: string;

  @ApiProperty({
    description: 'The machine ID',
    example: 'machine-123',
  })
  @IsString()
  @IsOptional()
  machine_id?: string;

  @ApiProperty({
    description: 'The IP address',
    example: '192.168.1.1',
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty({
    description: 'The configuration version',
    example: '1',
  })
  @IsString()
  @IsOptional()
  config?: string;

  @ApiProperty({
    description: 'The time in',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  time_in?: Date;

  @ApiProperty({
    description: 'The time out',
    example: '2024-03-14T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  time_out?: Date;

  @ApiProperty({
    description: 'The socket ID',
    example: 'socket-123',
  })
  @IsString()
  @IsOptional()
  socket_id?: string;

  @ApiProperty({
    description: 'The YS token',
    example: 'token-123',
  })
  @IsString()
  @IsOptional()
  ys_token?: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user-123',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'The TNT value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  tnt?: number;

  @ApiProperty({
    description: 'The FPT value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  fpt?: number;

  @ApiProperty({
    description: 'The CONV value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  conv?: number;

  @ApiProperty({
    description: 'The connection URI',
    example: 'rtsp://example.com/stream1',
  })
  @IsString()
  @IsOptional()
  connection_uri?: string;

  @ApiProperty({
    description: 'The sub-connection URI',
    example: 'rtsp://example.com/stream2',
  })
  @IsString()
  @IsOptional()
  sub_connection_uri?: string;

  @ApiProperty({
    description: 'The snapshot data',
    example: 'base64-encoded-image',
  })
  @IsString()
  @IsOptional()
  snapshot?: string;

  @ApiProperty({
    description: 'The GPS coordinates',
    example: '10.123456,106.789012',
  })
  @IsString()
  @IsOptional()
  gps_coordinates?: string;

  @ApiProperty({
    description: 'The pending engines configuration',
    example: '["engine3", "engine4"]',
  })
  @IsString()
  @IsOptional()
  pending_engines?: string;

  @ApiProperty({
    description: 'The location',
    example: 'Main Entrance',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'The snapshot creation timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  snapshot_created_at?: Date;

  @ApiProperty({
    description: 'The handling office',
    example: 'Office A',
  })
  @IsString()
  @IsOptional()
  handling_office?: string;

  @ApiProperty({
    description: 'The battery sync status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  battery_sync?: boolean;

  @ApiProperty({
    description: 'The battery threshold',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  battery_threshold?: number;

  @ApiProperty({
    description: 'Whether approval is required',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  require_approval?: boolean;

  @ApiProperty({
    description: 'The rule configuration',
    example: '{"conditions": []}',
  })
  @IsString()
  @IsOptional()
  rule?: string;

  @ApiProperty({
    description: 'The last ping timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  last_ping_at?: Date;

  @ApiProperty({
    description: 'The district',
    example: 'District 1',
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Whether approval is not required',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  dont_require_approval?: boolean;

  @ApiProperty({
    description: 'The sequence number format',
    example: 'YYYYMMDD',
  })
  @IsString()
  @IsOptional()
  seq_no_format?: string;

  @ApiProperty({
    description: 'The engines requiring approval',
    example: '["engine1", "engine2"]',
  })
  @IsString()
  @IsOptional()
  engines_require_approval?: string;

  @ApiProperty({
    description: 'The color',
    example: '#FF0000',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'The status of the monitor',
    enum: MonitorStatus,
    example: MonitorStatus.CONNECTED,
  })
  @IsEnum(MonitorStatus)
  @IsOptional()
  status?: MonitorStatus;

  @ApiProperty({
    description: 'The serial number',
    example: 'SN123456',
  })
  @IsString()
  @IsOptional()
  sn?: string;

  @ApiProperty({
    description: 'The description',
    example: 'Main entrance security camera',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The camera identification',
    example: 'CAM001',
  })
  @IsString()
  @IsOptional()
  camera_identification?: string;

  @ApiProperty({
    description: 'The platform device ID',
    example: 'PLAT-123',
  })
  @IsString()
  @IsOptional()
  platform_device_id?: string;

  @ApiProperty({
    description: 'The expiry date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  expiry_date?: Date;

  @ApiProperty({
    description: 'Whether the monitor is disabled',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @ApiProperty({
    description: 'The latest disabled timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  latest_disabled_at?: Date;

  @ApiProperty({
    description: 'The Zabbix host ID',
    example: 'zabbix-123',
  })
  @IsString()
  @IsOptional()
  zabbix_host_id?: string;
}
