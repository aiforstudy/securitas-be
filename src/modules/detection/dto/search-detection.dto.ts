import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { DetectionStatus } from '../enums/detection-status.enum';

export enum ApprovalStatus {
  YES = 'yes',
  NO = 'no',
  EXPIRED = 'expired',
}

export class SearchDetectionDto {
  @ApiPropertyOptional({
    description: 'Monitor name to search for',
    example: 'Main Entrance Camera',
  })
  @IsString()
  @IsOptional()
  monitor_name?: string;

  @ApiPropertyOptional({
    description: 'Company name to search for',
    example: 'Company A',
  })
  @IsString()
  @IsOptional()
  company_name?: string;

  @ApiPropertyOptional({
    description: 'Company code to search for',
    example: 'C001',
  })
  @IsString()
  @IsOptional()
  company_code?: string;

  @ApiPropertyOptional({
    description: 'Detection ID to search for',
    example: 'detection-123',
  })
  @IsString()
  @IsOptional()
  detection_id?: string;

  @ApiPropertyOptional({
    description: 'Detection status to filter by',
    enum: DetectionStatus,
    example: DetectionStatus.PENDING,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiPropertyOptional({
    description: 'Approval status to filter by',
    enum: ApprovalStatus,
    example: ApprovalStatus.YES,
  })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approved?: ApprovalStatus;

  @ApiPropertyOptional({
    description: 'From date to filter by (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    description: 'To date to filter by (ISO 8601 format)',
    example: '2024-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    description: 'Page number to filter by',
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Limit number to filter by',
    example: 10,
  })
  @IsOptional()
  limit?: number;
}
