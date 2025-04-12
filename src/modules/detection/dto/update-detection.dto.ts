import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DetectionStatus } from '../enums/detection-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';

export class UpdateDetectionDto {
  @ApiPropertyOptional({
    description: 'The status of the detection',
    example: DetectionStatus.PENDING,
    enum: DetectionStatus,
  })
  @IsEnum(DetectionStatus)
  @IsOptional()
  status?: DetectionStatus;

  @ApiPropertyOptional({
    description: 'The feedback status of the detection',
    example: FeedbackStatus.UNMARK,
    enum: FeedbackStatus,
  })
  @IsEnum(FeedbackStatus)
  @IsOptional()
  feedback_status?: FeedbackStatus;

  @ApiPropertyOptional({
    description: 'Whether the detection is unread',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiPropertyOptional({
    description: 'The approved status',
    example: 'yes',
  })
  @IsString()
  @IsOptional()
  approved?: string;

  @ApiPropertyOptional({
    description: 'The approved by',
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  approved_by?: string;
}
