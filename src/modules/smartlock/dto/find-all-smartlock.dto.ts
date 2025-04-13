import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

export class FindAllSmartLockDto {
  @ApiPropertyOptional({
    description: 'Search by name or serial number',
    example: 'Front Door',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by company code',
    example: 'COMP001',
  })
  @IsString()
  @IsOptional()
  company_code?: string;

  @ApiPropertyOptional({
    description: 'Filter by connection status',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
  })
  @IsEnum(SmartLockStatus)
  @IsOptional()
  status?: SmartLockStatus;
}
