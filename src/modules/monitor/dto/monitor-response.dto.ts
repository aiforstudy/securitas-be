import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Monitor } from '../entities/monitor.entity';

@Exclude()
export class MonitorResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the monitor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The code of the monitor',
    example: 'MON001',
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the monitor',
    example: 'Main Entrance Camera',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The type of the monitor',
    example: 'camera',
  })
  type: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the monitor',
    example: 'active',
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'The location of the monitor',
    example: 'Main Entrance',
  })
  location: string;

  @Expose()
  @ApiProperty({
    description: 'The company code associated with the monitor',
    example: 'COMP001',
  })
  company_code: string;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the monitor was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the monitor was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<Monitor>) {
    Object.assign(this, partial);
  }
}
