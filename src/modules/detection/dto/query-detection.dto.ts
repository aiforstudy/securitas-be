import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetectionStatus, FeedbackStatus } from '../enums/detection.enum';

export class QueryDetectionDto {
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'The monitor ID to filter by',
    example: 'monitor-123',
  })
  @IsString()
  @IsOptional()
  monitor_id?: string;

  @ApiPropertyOptional({
    description: 'The engine to filter by',
    example: 'engine1',
  })
  @IsString()
  @IsOptional()
  engine?: string;

  @ApiPropertyOptional({
    description: 'The status to filter by',
    example: DetectionStatus.PENDING,
    enum: DetectionStatus,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiPropertyOptional({
    description: 'The feedback status to filter by',
    example: FeedbackStatus.UNMARK,
    enum: FeedbackStatus,
  })
  @IsEnum(FeedbackStatus)
  @IsOptional()
  feedback_status?: FeedbackStatus;

  @ApiPropertyOptional({
    description: 'Filter by alert status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  alert?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by unread status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiPropertyOptional({
    description: 'The start date to filter by',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @ApiPropertyOptional({
    description: 'The end date to filter by',
    example: '2024-03-14T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;

  @ApiPropertyOptional({
    description: 'Filter by approved status',
    enum: ['yes', 'no', 'expired'],
    example: 'yes',
  })
  @IsString()
  @IsOptional()
  approved?: string;
}
