import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The unique identifier of the detection',
    example: 'detection-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'The timestamp of the detection',
    example: '2024-03-14T00:00:00Z',
    required: false,
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

  @ApiProperty({
    description: 'The status of the detection',
    enum: DetectionStatus,
    example: DetectionStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(DetectionStatus)
  status: DetectionStatus;

  @ApiProperty({
    description: 'The feedback status of the detection',
    enum: FeedbackStatus,
    example: FeedbackStatus.UNMARK,
  })
  @IsOptional()
  @IsEnum(FeedbackStatus)
  feedback_status: FeedbackStatus;

  @ApiProperty({
    description: 'Whether the detection is an alert',
    example: 'Y',
  })
  @IsOptional()
  @IsString()
  alert: string;

  @ApiProperty({
    description: 'The district where the detection occurred',
    example: 'District 1',
  })
  @IsOptional()
  @IsString()
  district: string;

  @ApiProperty({
    description: 'The suspected offense',
    example: 'Test Offense',
  })
  @IsOptional()
  @IsString()
  suspected_offense: string;

  @ApiProperty({
    description: 'The type of vehicle',
    example: 'car',
  })
  @IsOptional()
  @IsString()
  vehicle_type: string;

  @ApiProperty({
    description: 'The license plate number',
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  license_plate: string;

  @ApiProperty({
    description: 'Additional metadata about the detection',
    example: {},
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'URL to the detection image',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    description: 'URL to the detection video',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @IsOptional()
  @IsString()
  video_url?: string;
}
