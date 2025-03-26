import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class PaginatedCompanyDto {
  @ApiProperty({
    description: 'Array of companies',
    type: [Company],
  })
  data: Company[];

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
