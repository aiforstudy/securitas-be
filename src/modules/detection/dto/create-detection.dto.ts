import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsUUID,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetectionStatus, FeedbackStatus } from '../enums/detection.enum';

export class CreateDetectionDto {
  @ApiPropertyOptional({
    description: 'The unique identifier of the detection',
    example: 'detection-123',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'The timestamp of the detection',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;

  @ApiProperty({
    description: 'The monitor ID',
    example: 'monitor-1',
  })
  @IsString()
  monitor_id: string;

  @ApiProperty({
    description: 'The engine ID',
    example: 'engine-1',
  })
  @IsString()
  engine: string;

  @ApiPropertyOptional({
    description: 'The status of the detection',
    enum: DetectionStatus,
    example: DetectionStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(DetectionStatus)
  status: DetectionStatus;

  @ApiPropertyOptional({
    description: 'The feedback status of the detection',
    enum: FeedbackStatus,
    example: FeedbackStatus.UNMARK,
  })
  @IsOptional()
  @IsEnum(FeedbackStatus)
  feedback_status: FeedbackStatus;

  @ApiPropertyOptional({
    description: 'Whether the detection is an alert',
    example: 'Y',
  })
  @IsOptional()
  @IsString()
  alert: string;

  @ApiPropertyOptional({
    description: 'The district where the detection occurred',
    example: 'District 1',
  })
  @IsOptional()
  @IsString()
  district: string;

  @ApiPropertyOptional({
    description: 'The suspected offense',
    example: 'Test Offense',
  })
  @IsOptional()
  @IsString()
  suspected_offense: string;

  @ApiPropertyOptional({
    description: 'The type of vehicle',
    example: 'car',
  })
  @IsOptional()
  @IsString()
  vehicle_type: string;

  @ApiPropertyOptional({
    description: 'The license plate number',
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  license_plate: string;

  @ApiPropertyOptional({
    description: 'Additional metadata about the detection',
    example: {},
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'URL to the detection image',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'URL to the detection video',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsString()
  video_url?: string;
}
