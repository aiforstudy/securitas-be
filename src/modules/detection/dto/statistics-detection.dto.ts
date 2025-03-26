import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticsDetectionDto {
  @ApiProperty({
    description: 'Start date for statistics',
    example: '2024-03-14T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  from: Date;

  @ApiProperty({
    description: 'End date for statistics',
    example: '2024-03-14T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  to: Date;

  @ApiProperty({
    description: 'Timezone string (e.g., Asia/Ho_Chi_Minh)',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsString()
  timezone: string;

  @ApiProperty({
    description: 'Group by day or hour',
    example: 'day',
    enum: ['day', 'hour'],
  })
  @IsString()
  group_by: 'day' | 'hour';
}

export class DetectionStatisticsResponseDto {
  @ApiProperty({
    description: 'Engine name',
    example: 'engine1',
  })
  engine: string;

  @ApiProperty({
    description: 'Timestamp of the statistics',
    example: '2024-03-14T00:00:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Number of detections',
    example: 100,
  })
  count: number;
}
