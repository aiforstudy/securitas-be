import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

export class CreateSmartLockDto {
  @ApiProperty({
    description: 'Serial number of the smartlock',
    example: 'SL-123456',
  })
  @IsString()
  @IsNotEmpty()
  sn: string;

  @ApiProperty({
    description: 'Name of the smartlock',
    example: 'Front Door Lock',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Latitude coordinate of the smartlock location',
    example: 10.762622,
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate of the smartlock location',
    example: 106.660172,
  })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({
    description: 'Connection status of the smartlock',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
    default: SmartLockStatus.DISCONNECTED,
  })
  @IsEnum(SmartLockStatus)
  @IsOptional()
  status?: SmartLockStatus;
}
