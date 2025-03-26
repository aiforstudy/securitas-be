import { ApiProperty } from '@nestjs/swagger';
import { Detection } from '../entities/detection.entity';

export class PaginatedDetectionDto {
  @ApiProperty({
    description: 'The list of detections',
    type: [Detection],
  })
  data: Detection[];

  @ApiProperty({
    description: 'The current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'The total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'The total number of pages',
    example: 10,
  })
  total_pages: number;
}
