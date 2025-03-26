import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitorStatus } from '../enums/monitor-status.enum';

export class QueryMonitorDto {
  @ApiProperty({
    description: 'The page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'The company code to filter by',
    example: 'COMP001',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_code?: string;

  @ApiProperty({
    description: 'The status to filter by',
    enum: MonitorStatus,
    example: MonitorStatus.CONNECTED,
    required: false,
  })
  @IsOptional()
  @IsEnum(MonitorStatus)
  status?: MonitorStatus;

  @ApiProperty({
    description: 'The search term to filter by name or description',
    example: 'camera',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
