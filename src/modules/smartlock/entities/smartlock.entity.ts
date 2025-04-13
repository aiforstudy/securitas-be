import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SmartLockStatus } from '../enums/smartlock-status.enum';

@Entity('smartlocks')
export class SmartLock {
  @ApiProperty({
    description: 'Unique identifier of the smartlock',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Serial number of the smartlock',
    example: 'SL-123456',
  })
  @Column({ unique: true })
  sn: string;

  @ApiProperty({
    description: 'Name of the smartlock',
    example: 'Front Door Lock',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Latitude coordinate of the smartlock location',
    example: 10.762622,
  })
  @Column('decimal', { precision: 10, scale: 6, default: 0 })
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate of the smartlock location',
    example: 106.660172,
  })
  @Column('decimal', { precision: 10, scale: 6, default: 0 })
  lng: number;

  @ApiProperty({
    description: 'Connection status of the smartlock',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
    default: SmartLockStatus.DISCONNECTED,
  })
  @Column({
    type: 'enum',
    enum: SmartLockStatus,
    default: SmartLockStatus.DISCONNECTED,
  })
  status: SmartLockStatus;

  @ApiProperty({
    description: 'Latest update time of the smartlock',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  latest_time: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-20T10:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-20T10:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
