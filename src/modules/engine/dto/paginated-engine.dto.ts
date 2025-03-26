import { ApiProperty } from '@nestjs/swagger';
import { Engine } from '../entities/engine.entity';

export class PaginatedEngineDto {
  @ApiProperty({
    description: 'List of engines',
    type: [Engine],
  })
  data: Engine[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  total_pages: number;
}
