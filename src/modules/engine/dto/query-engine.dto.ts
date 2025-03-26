import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryEngineDto {
  @ApiProperty({
    description: 'Engine name to search for',
    example: 'Face Detection',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Whether to show on home page',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  show_on_home?: boolean;

  @ApiProperty({
    description: 'Whether the engine is enabled',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
