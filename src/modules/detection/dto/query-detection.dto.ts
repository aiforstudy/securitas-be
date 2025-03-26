import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The page number',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'The monitor ID to filter by',
    example: 'monitor-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  monitor_id?: string;

  @ApiProperty({
    description: 'The engine to filter by',
    example: 'engine1',
    required: false,
  })
  @IsString()
  @IsOptional()
  engine?: string;

  @ApiProperty({
    description: 'The status to filter by',
    example: DetectionStatus.PENDING,
    enum: DetectionStatus,
    required: false,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiProperty({
    description: 'The feedback status to filter by',
    example: FeedbackStatus.UNMARK,
    enum: FeedbackStatus,
    required: false,
  })
  @IsEnum(FeedbackStatus)
  @IsOptional()
  feedback_status?: FeedbackStatus;

  @ApiProperty({
    description: 'Filter by alert status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  alert?: boolean;

  @ApiProperty({
    description: 'Filter by unread status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiProperty({
    description: 'The start date to filter by',
    example: '2024-03-14T00:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @ApiProperty({
    description: 'The end date to filter by',
    example: '2024-03-14T23:59:59Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;

  @ApiProperty({
    description: 'The district to filter by',
    example: 'District 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'The suspected offense to filter by',
    example: 'Speeding',
    required: false,
  })
  @IsString()
  @IsOptional()
  suspected_offense?: string;

  @ApiProperty({
    description: 'The vehicle type to filter by',
    example: 'Car',
    required: false,
  })
  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @ApiProperty({
    description: 'The license plate to filter by',
    example: 'ABC123',
    required: false,
  })
  @IsString()
  @IsOptional()
  license_plate?: string;
}
