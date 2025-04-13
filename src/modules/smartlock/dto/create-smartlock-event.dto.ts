import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSmartLockEventDto {
  @ApiProperty({
    description: 'Serial number of the smartlock',
    example: 'SL-123456',
  })
  @IsString()
  sn: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 10.762622,
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 106.660172,
  })
  @IsNumber()
  lng: number;

  @ApiProperty({
    description: 'Temperature in Celsius',
    example: 25.5,
  })
  @IsNumber()
  temperature: number;

  @ApiProperty({
    description: 'Humidity percentage',
    example: 65.5,
  })
  @IsNumber()
  humidity: number;

  @ApiProperty({
    description: 'Battery level percentage',
    example: 85,
  })
  @IsNumber()
  battery_level: number;
}
