import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { DetectionStatus } from '../enums/detection-status.enum';

export enum ApprovalStatus {
  YES = 'yes',
  NO = 'no',
  EXPIRED = 'expired',
}

export class SearchDetectionDto {
  @ApiProperty({
    description: 'Monitor name to search for',
    example: 'Main Entrance Camera',
    required: false,
  })
  @IsString()
  @IsOptional()
  monitor_name?: string;

  @ApiProperty({
    description: 'Company name to search for',
    example: 'Company A',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    description: 'Company code to search for',
    example: 'C001',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_code?: string;

  @ApiProperty({
    description: 'Detection ID to search for',
    example: 'detection-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  detection_id?: string;

  @ApiProperty({
    description: 'Detection status to filter by',
    enum: DetectionStatus,
    example: DetectionStatus.PENDING,
    required: false,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiProperty({
    description: 'Approval status to filter by',
    enum: ApprovalStatus,
    example: ApprovalStatus.YES,
    required: false,
  })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approved?: ApprovalStatus;

  @ApiProperty({
    description: 'From date to filter by (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiProperty({
    description: 'To date to filter by (ISO 8601 format)',
    example: '2024-01-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiProperty({
    description: 'Page number to filter by',
    example: 1,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Limit number to filter by',
    example: 10,
    required: false,
  })
  @IsOptional()
  limit?: number;
}
