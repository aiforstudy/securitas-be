import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize, IsOptional } from 'class-validator';

export class BulkApproveDetectionDto {
  @ApiProperty({
    description: 'Array of detection IDs to approve',
    example: ['detection-1', 'detection-2'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  detection_ids: string[];

  @ApiProperty({
    description: 'User ID who is approving the detections',
    example: 'user-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  approved_by?: string;
}
