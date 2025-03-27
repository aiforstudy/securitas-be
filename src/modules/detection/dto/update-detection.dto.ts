import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
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
    description: 'Whether the detection is unread',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiProperty({
    description: 'The approved status',
    example: 'yes',
    required: false,
  })
  @IsString()
  @IsOptional()
  approved?: string;

  @ApiProperty({
    description: 'The approved by',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  approved_by?: string;
}
