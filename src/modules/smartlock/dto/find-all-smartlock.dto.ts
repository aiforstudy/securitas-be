import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

export class FindAllSmartLockDto {
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
