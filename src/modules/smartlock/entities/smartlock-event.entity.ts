import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SmartLock } from './smartlock.entity';

@Entity('smartlock_events')
export class SmartLockEvent {
  @ApiProperty({
    description: 'Unique identifier for the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Serial number of the smart lock',
    example: 'SL-100001',
  })
  @Column()
  sn: string;

  @ApiProperty({
    description: 'Latitude of the event location',
    example: 10.772,
  })
  @Column('decimal', { precision: 10, scale: 6 })
  lat: number;

  @ApiProperty({
    description: 'Longitude of the event location',
    example: 106.6983,
  })
  @Column('decimal', { precision: 10, scale: 6 })
  lng: number;

  @ApiProperty({
    description: 'Temperature in Celsius',
    example: 28.5,
  })
  @Column('decimal', { precision: 4, scale: 1 })
  temperature: number;

  @ApiProperty({
    description: 'Humidity percentage',
    example: 65.5,
  })
  @Column('decimal', { precision: 4, scale: 1 })
  humidity: number;

  @ApiProperty({
    description: 'Battery level percentage',
    example: 95,
  })
  @Column('decimal', { precision: 4, scale: 1 })
  battery_level: number;

  @ApiProperty({
    description: 'Timestamp when the event was created',
    example: '2025-04-13T08:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the event was last updated',
    example: '2025-04-13T08:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => SmartLock, (smartlock) => smartlock.events)
  @JoinColumn({ name: 'sn', referencedColumnName: 'sn' })
  smartlock: SmartLock;
}
