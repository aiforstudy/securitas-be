import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FindSmartLockEventDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Serial number to filter events',
    example: 'SL-100001',
  })
  @IsString()
  @IsOptional()
  sn?: string;

  @ApiPropertyOptional({
    description: 'Start date for filtering events (ISO format)',
    example: '2025-04-13T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering events (ISO format)',
    example: '2025-04-13T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  to?: string;
}
