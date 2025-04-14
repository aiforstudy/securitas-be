import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

export class FindSmartLockDto {
  @ApiPropertyOptional({
    description: 'Search term for name or serial number',
    example: 'Front Door',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Company code associated with the smart lock',
    example: 'COMP123',
  })
  @IsString()
  @IsOptional()
  company_code?: string;

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
    description: 'Status of the smart lock',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
  })
  @IsEnum(SmartLockStatus)
  @IsOptional()
  status?: SmartLockStatus;

  @ApiPropertyOptional({
    description: 'Start date for filtering by latest_time (ISO format)',
    example: '2025-04-13T00:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering by latest_time (ISO format)',
    example: '2025-04-13T23:59:59.999Z',
  })
  @IsString()
  @IsOptional()
  to?: string;
}
