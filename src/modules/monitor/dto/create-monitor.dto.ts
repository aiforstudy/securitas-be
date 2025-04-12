import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
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
    description: 'The engines configuration as JSON string',
    example: '["engine1", "engine2"]',
  })
  @IsString()
  @IsOptional()
  engines?: string;

  @ApiPropertyOptional({
    description: 'The zone configuration as JSON string',
    example: '{"points": []}',
  })
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiPropertyOptional({
    description: 'The type of monitor',
    example: 'camera',
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
    description: 'The user ID',
    example: 'user-123',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'The connection URI',
    example: 'rtsp://example.com/stream1',
  })
  @IsString()
  @IsOptional()
  connection_uri?: string;

  @ApiPropertyOptional({
    description: 'The hls URI',
    example: 'http://example.com/stream.m3u8',
  })
  @IsString()
  @IsOptional()
  hls_uri?: string;

  @ApiPropertyOptional({
    description: 'The snapshot data',
    example: 'base64-encoded-image',
  })
  @IsString()
  @IsOptional()
  snapshot?: string;

  @ApiPropertyOptional({
    description: 'The location',
    example: 'Main Entrance',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'The last ping timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  last_ping_at?: Date;

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
}
