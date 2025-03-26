import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('engines')
export class Engine {
  @ApiProperty({
    description: 'The unique identifier of the engine',
    example: 'engine-1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the engine',
    example: 'Test Engine',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the engine',
    example: 'Test Engine Description',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'The type of engine',
    example: 'test',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: 'The version of the engine',
    example: '1.0.0',
  })
  @Column()
  version: string;

  @ApiProperty({
    description: 'The status of the engine',
    example: 'active',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'The timestamp when the engine was created',
    example: '2024-03-14T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the engine was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
