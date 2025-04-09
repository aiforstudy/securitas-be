import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { DetectionApprovalStatus } from '../enums/detection-approval-status.enum';

export class BulkApproveDetectionDto {
  @ApiProperty({
    description: 'Array of detection IDs to approve',
    example: ['detection-1', 'detection-2'],
    type: [String],
  })
  @IsArray()
  detection_ids: string[];

  @ApiProperty({
    description: 'The approval status',
    enum: DetectionApprovalStatus,
    example: DetectionApprovalStatus.YES,
  })
  @IsEnum(DetectionApprovalStatus)
  approved: DetectionApprovalStatus;

  @ApiProperty({
    description: 'The user who approved the detection',
    example: 'user-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  approved_by?: string;
}
