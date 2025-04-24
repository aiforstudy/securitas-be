import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Engine } from '../entities/engine.entity';

@Exclude()
export class EngineResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the engine',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The code of the engine',
    example: 'ENG001',
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the engine',
    example: 'Main Engine',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The type of the engine',
    example: 'detection',
  })
  type: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the engine',
    example: 'active',
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'The version of the engine',
    example: '1.0.0',
  })
  version: string;

  @Expose()
  @ApiProperty({
    description: 'The company code associated with the engine',
    example: 'COMP001',
  })
  company_code: string;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the engine was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the engine was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<Engine>) {
    Object.assign(this, partial);
  }
}
