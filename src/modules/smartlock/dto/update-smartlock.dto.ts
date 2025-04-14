import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

export class UpdateSmartLockDto {
  @ApiPropertyOptional({
    description: 'Name of the smart lock',
    example: 'Front Door',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Status of the smart lock',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
  })
  @IsEnum(SmartLockStatus)
  @IsOptional()
  status?: SmartLockStatus;

  @ApiPropertyOptional({
    description: 'Company code associated with the smart lock',
    example: 'COMP123',
  })
  @IsString()
  @IsOptional()
  company_code?: string;
}
