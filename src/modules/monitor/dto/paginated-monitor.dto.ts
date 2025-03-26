import { ApiProperty } from '@nestjs/swagger';
import { Monitor } from '../entities/monitor.entity';

export class PaginatedMonitorDto {
  @ApiProperty({
    description: 'Array of monitors',
    type: [Monitor],
  })
  data: Monitor[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    type: Number,
  })
  total_pages: number;
}
