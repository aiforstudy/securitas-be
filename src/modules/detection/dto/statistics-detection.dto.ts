import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticsDetectionDto {
  @ApiProperty({
    description: 'The company code',
    example: 'company-123',
  })
  @IsString()
  company_code: string;

  @ApiProperty({
    description: 'Start date for statistics',
    example: '2024-03-14T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  from: Date;

  @ApiProperty({
    description: 'End date for statistics',
    example: '2024-03-14T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  to: Date;

  @ApiPropertyOptional({
    description: 'Timezone for date formatting',
    example: 'Asia/Ho_Chi_Minh',
    default: 'UTC',
  })
  @IsString()
  @IsOptional()
  timezone?: string = 'UTC';

  @ApiPropertyOptional({
    description: 'Group by time unit',
    enum: ['day', 'hour'],
    default: 'day',
  })
  @IsEnum(['day', 'hour'])
  @IsOptional()
  group_by?: 'day' | 'hour' = 'day';
}

export interface StatisticsResultDto {
  timestamp: string;
  [key: string]: string | number;
}

export class DetectionStatisticsDataDto {
  @ApiProperty({
    description: 'Timestamp of the statistics entry in ISO 8601 format',
    example: '2024-03-14T00:00:00Z',
  })
  @IsString()
  timestamp: string;

  [key: string]: string | number;
}

export class DetectionStatisticsResponseDto {
  @ApiProperty({
    description: 'Array of statistics data',
    type: [DetectionStatisticsDataDto],
  })
  data: DetectionStatisticsDataDto[];

  @ApiProperty({
    description: 'Map of engine details',
    example: {
      'engine-id-1': {
        name: 'Engine 1',
        description: 'Description of Engine 1',
      },
    },
  })
  engines: Record<string, { name: string; description?: string }>;
}
