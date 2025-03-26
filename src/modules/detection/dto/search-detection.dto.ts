import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
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
  approval_status?: ApprovalStatus;
}
