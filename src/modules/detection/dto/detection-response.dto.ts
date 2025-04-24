import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Detection } from '../entities/detection.entity';

@Exclude()
export class DetectionResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the detection',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The code of the detection',
    example: 'DET001',
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'The type of the detection',
    example: 'motion',
  })
  type: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the detection',
    example: 'active',
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'The confidence score of the detection',
    example: 0.95,
  })
  confidence: number;

  @Expose()
  @ApiProperty({
    description: 'The timestamp of the detection',
    example: '2024-03-14T00:00:00Z',
  })
  timestamp: Date;

  @Expose()
  @ApiProperty({
    description: 'The monitor code associated with the detection',
    example: 'MON001',
  })
  monitor_code: string;

  @Expose()
  @ApiProperty({
    description: 'The engine code associated with the detection',
    example: 'ENG001',
  })
  engine_code: string;

  @Expose()
  @ApiProperty({
    description: 'The company code associated with the detection',
    example: 'COMP001',
  })
  company_code: string;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the detection was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the detection was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<Detection>) {
    Object.assign(this, partial);
  }
}
