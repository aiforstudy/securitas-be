import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Monitor } from '../../monitor/entities/monitor.entity';
import { DetectionStatus } from '../enums/detection-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import { Engine } from '../../engine/entities/engine.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('detections')
export class Detection {
  @ApiProperty({
    description: 'The unique identifier of the detection',
    example: 'detection-123',
  })
  @PrimaryColumn({ length: 45 })
  id: string;

  @ApiProperty({
    description: 'The timestamp of the detection',
    example: '2024-03-14T00:00:00Z',
  })
  @PrimaryColumn({ type: 'datetime' })
  timestamp: Date;

  @ApiProperty({
    description: 'The monitor ID',
    example: 'monitor-1',
  })
  @Column({ length: 45 })
  monitor_id: string;

  @ApiPropertyOptional({
    description: 'The approved status',
    example: 'yes',
  })
  @Column({ length: 45 })
  approved: string;

  @ApiPropertyOptional({
    description: 'The zone ID',
    example: 'zone-1',
  })
  @Column()
  zone: string;

  @ManyToOne(() => Monitor, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'monitor_id' })
  monitor: Monitor;

  @ApiProperty({
    description: 'The engine ID',
    example: 'engine-1',
  })
  @Column()
  engine: string;

  @ManyToOne(() => Engine, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'engine' })
  engineDetail: Engine;

  @ApiProperty({
    description: 'The status of the detection',
    enum: DetectionStatus,
    example: DetectionStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: DetectionStatus,
    default: DetectionStatus.PENDING,
  })
  status: DetectionStatus;

  @ApiProperty({
    description: 'The feedback status of the detection',
    enum: FeedbackStatus,
    example: FeedbackStatus.UNMARK,
  })
  @Column({
    type: 'enum',
    enum: FeedbackStatus,
    default: FeedbackStatus.UNMARK,
    nullable: true,
  })
  feedback_status: FeedbackStatus;

  @ApiProperty({
    description: 'Whether the detection is an alert',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  alert: boolean;

  @ApiProperty({
    description: 'Whether the detection is unread',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  unread: boolean;

  @ApiProperty({
    description: 'The district where the detection occurred',
    example: 'District 1',
  })
  @Column({ length: 255, nullable: true })
  district: string;

  @ApiProperty({
    description: 'The suspected offense',
    example: 'Test Offense',
  })
  @Column({ length: 255, nullable: true })
  suspected_offense: string;

  @ApiProperty({
    description: 'The type of vehicle',
    example: 'car',
  })
  @Column({ length: 255, nullable: true })
  vehicle_type: string;

  @ApiProperty({
    description: 'The license plate number',
    example: 'ABC123',
  })
  @Column({ length: 255, nullable: true })
  license_plate: string;

  @ApiProperty({
    description: 'Additional metadata about the detection',
    example: {},
  })
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'The timestamp when the detection was created',
    example: '2024-03-14T00:00:00Z',
  })
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the detection was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
