import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsEnum, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Engine } from '../../engine/entities/engine.entity';

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

export class DetectionStatisticsDataDto {
  @ApiProperty({
    description: 'Timestamp of the statistics',
    example: '2024-03-14T00:00:00Z',
  })
  timestamp: Date;

  // Dynamic properties for engine counts
  [key: string]: number | Date;
}

export class DetectionStatisticsResponseDto {
  @ApiProperty({
    description: 'Array of statistics data by timestamp',
    type: [DetectionStatisticsDataDto],
  })
  @IsArray()
  data: DetectionStatisticsDataDto[];

  @ApiProperty({
    description: 'Engine details for each engine',
    type: 'object',
    additionalProperties: {
      type: 'object',
      $ref: '#/components/schemas/Engine',
    },
  })
  @IsObject()
  engines: Record<string, Engine>;
}
