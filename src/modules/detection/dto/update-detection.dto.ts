import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { DetectionStatus } from '../enums/detection-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';

export class UpdateDetectionDto {
  @ApiProperty({
    description: 'The status of the detection',
    example: DetectionStatus.PENDING,
    enum: DetectionStatus,
    required: false,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiProperty({
    description: 'The feedback status of the detection',
    example: FeedbackStatus.UNMARK,
    enum: FeedbackStatus,
    required: false,
  })
  @IsEnum(FeedbackStatus)
  @IsOptional()
  feedback_status?: FeedbackStatus;

  @ApiProperty({
    description: 'Whether the detection is an alert',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  alert?: boolean;

  @ApiProperty({
    description: 'Whether the detection is unread',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiProperty({
    description: 'The district where the detection occurred',
    example: 'District 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'The suspected offense',
    example: 'Speeding',
    required: false,
  })
  @IsString()
  @IsOptional()
  suspected_offense?: string;

  @ApiProperty({
    description: 'The type of vehicle detected',
    example: 'Car',
    required: false,
  })
  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @ApiProperty({
    description: 'The license plate of the vehicle',
    example: 'ABC123',
    required: false,
  })
  @IsString()
  @IsOptional()
  license_plate?: string;

  @ApiProperty({
    description: 'Additional metadata for the detection',
    example: { speed: 120, confidence: 0.95 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
