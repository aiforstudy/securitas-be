import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({
    description: 'The name of the monitor',
    example: 'Main Entrance Camera',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The RTMP URI for the monitor stream',
    example: 'rtmp://example.com/live/stream1',
  })
  @IsString()
  @IsOptional()
  rtmp_uri?: string;

  @ApiPropertyOptional({
    description: 'Whether to play from source',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  play_from_source?: boolean;

  @ApiPropertyOptional({
    description: 'The engines configuration as JSON string',
    example: '["engine1", "engine2"]',
  })
  @IsString()
  @IsOptional()
  engines?: string;

  @ApiPropertyOptional({
    description: 'Whether recording is enabled',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  recording?: boolean;

  @ApiPropertyOptional({
    description: 'The graph configuration as JSON string',
    example: '{"nodes": [], "edges": []}',
  })
  @IsString()
  @IsOptional()
  graph: string;

  @ApiPropertyOptional({
    description: 'The zone configuration as JSON string',
    example: '{"points": []}',
  })
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiPropertyOptional({
    description: 'The type of monitor',
    example: 'ys',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'The device ID',
    example: 'device-123',
  })
  @IsString()
  @IsOptional()
  device_id?: string;

  @ApiPropertyOptional({
    description: 'The machine ID',
    example: 'machine-123',
  })
  @IsString()
  @IsOptional()
  machine_id?: string;

  @ApiPropertyOptional({
    description: 'The IP address',
    example: '192.168.1.1',
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({
    description: 'The configuration version',
    example: '1',
  })
  @IsString()
  @IsOptional()
  config?: string;

  @ApiPropertyOptional({
    description: 'The time in',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  time_in?: Date;

  @ApiPropertyOptional({
    description: 'The time out',
    example: '2024-03-14T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  time_out?: Date;

  @ApiPropertyOptional({
    description: 'The socket ID',
    example: 'socket-123',
  })
  @IsString()
  @IsOptional()
  socket_id?: string;

  @ApiPropertyOptional({
    description: 'The YS token',
    example: 'token-123',
  })
  @IsString()
  @IsOptional()
  ys_token?: string;

  @ApiPropertyOptional({
    description: 'The user ID',
    example: 'user-123',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'The TNT value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  tnt?: number;

  @ApiPropertyOptional({
    description: 'The FPT value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  fpt?: number;

  @ApiPropertyOptional({
    description: 'The CONV value',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  conv?: number;

  @ApiPropertyOptional({
    description: 'The connection URI',
    example: 'rtsp://example.com/stream1',
  })
  @IsString()
  @IsOptional()
  connection_uri?: string;

  @ApiPropertyOptional({
    description: 'The sub-connection URI',
    example: 'rtsp://example.com/stream2',
  })
  @IsString()
  @IsOptional()
  sub_connection_uri?: string;

  @ApiPropertyOptional({
    description: 'The snapshot data',
    example: 'base64-encoded-image',
  })
  @IsString()
  @IsOptional()
  snapshot?: string;

  @ApiPropertyOptional({
    description: 'The GPS coordinates',
    example: '10.123456,106.789012',
  })
  @IsString()
  @IsOptional()
  gps_coordinates?: string;

  @ApiPropertyOptional({
    description: 'The pending engines configuration',
    example: '["engine3", "engine4"]',
  })
  @IsString()
  @IsOptional()
  pending_engines?: string;

  @ApiPropertyOptional({
    description: 'The location',
    example: 'Main Entrance',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'The snapshot creation timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  snapshot_created_at?: Date;

  @ApiPropertyOptional({
    description: 'The handling office',
    example: 'Office A',
  })
  @IsString()
  @IsOptional()
  handling_office?: string;

  @ApiPropertyOptional({
    description: 'The battery sync status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  battery_sync?: boolean;

  @ApiPropertyOptional({
    description: 'The battery threshold',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  battery_threshold?: number;

  @ApiPropertyOptional({
    description: 'Whether approval is required',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  require_approval?: boolean;

  @ApiPropertyOptional({
    description: 'The rule configuration',
    example: '{"conditions": []}',
  })
  @IsString()
  @IsOptional()
  rule?: string;

  @ApiPropertyOptional({
    description: 'The last ping timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  last_ping_at?: Date;

  @ApiPropertyOptional({
    description: 'The district',
    example: 'District 1',
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({
    description: 'Whether approval is not required',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  dont_require_approval?: boolean;

  @ApiPropertyOptional({
    description: 'The sequence number format',
    example: 'YYYYMMDD',
  })
  @IsString()
  @IsOptional()
  seq_no_format?: string;

  @ApiPropertyOptional({
    description: 'The engines requiring approval',
    example: '["engine1", "engine2"]',
  })
  @IsString()
  @IsOptional()
  engines_require_approval?: string;

  @ApiPropertyOptional({
    description: 'The color',
    example: '#FF0000',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'The status of the monitor',
    enum: MonitorStatus,
    example: MonitorStatus.CONNECTED,
  })
  @IsEnum(MonitorStatus)
  @IsOptional()
  status?: MonitorStatus;

  @ApiPropertyOptional({
    description: 'The serial number',
    example: 'SN123456',
  })
  @IsString()
  @IsOptional()
  sn?: string;

  @ApiPropertyOptional({
    description: 'The description',
    example: 'Main entrance security camera',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The camera identification',
    example: 'CAM001',
  })
  @IsString()
  @IsOptional()
  camera_identification?: string;

  @ApiPropertyOptional({
    description: 'The platform device ID',
    example: 'PLAT-123',
  })
  @IsString()
  @IsOptional()
  platform_device_id?: string;

  @ApiPropertyOptional({
    description: 'The expiry date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  expiry_date?: Date;

  @ApiPropertyOptional({
    description: 'Whether the monitor is disabled',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @ApiPropertyOptional({
    description: 'The latest disabled timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  latest_disabled_at?: Date;

  @ApiPropertyOptional({
    description: 'The Zabbix host ID',
    example: 'zabbix-123',
  })
  @IsString()
  @IsOptional()
  zabbix_host_id?: string;
}
