import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    description: 'Latitude coordinate of the smartlock location',
    example: 10.762622,
  })
  @IsNumber()
  lat: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the smartlock location',
    example: 106.660172,
  })
  @IsNumber()
  lng: number;
}
