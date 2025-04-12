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
import { Company } from '../../company/entities/company.entity';
import { MonitorStatus } from '../enums/monitor-status.enum';

@Entity('monitors')
export class Monitor {
  @ApiProperty({
    description: 'The unique identifier of the monitor',
    example: 'monitor-123',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The company code associated with the monitor',
    example: 'COMP001',
  })
  @Column('varchar', { length: 100 })
  company_code: string;

  @ApiProperty({
    description: 'The name of the monitor',
    example: 'Main Entrance Camera',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The engines configuration as JSON string',
    example: '["engine1", "engine2"]',
  })
  @Column('text')
  engines: string;

  @ApiProperty({
    description: 'The zone configuration as JSON string',
    example: '{"points": []}',
  })
  @Column('text', { nullable: true })
  zone: string;

  @ApiProperty({
    description: 'The type of monitor',
    example: 'camera',
  })
  @Column({ default: 'camera', length: 45 })
  type: string;

  @ApiProperty({
    description: 'The device ID',
    example: 'device-123',
  })
  @Column({ nullable: true, length: 45 })
  device_id: string;

  @ApiProperty({
    description: 'The IP address',
    example: '192.168.1.1',
  })
  @Column({ default: '0.0.0.0', length: 45 })
  ip: string;

  @ApiProperty({
    description: 'The configuration version',
    example: '1',
  })
  @Column({ nullable: true, length: 45 })
  config: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user-123',
  })
  @Column({ nullable: true, length: 45 })
  user_id: string;

  @ApiProperty({
    description: 'The connection URI',
    example: 'rtsp://example.com/stream1',
  })
  @Column({ nullable: true })
  connection_uri: string;

  @ApiProperty({
    description: 'The hls URI',
    example: 'http://example.com/stream.m3u8',
  })
  @Column({ nullable: true })
  hls_uri: string;

  @ApiProperty({
    description: 'The snapshot data',
    example: 'base64-encoded-image',
  })
  @Column('text', { nullable: true })
  snapshot: string;

  @ApiProperty({
    description: 'The location',
    example: 'Main Entrance',
  })
  @Column()
  location: string;

  @ApiProperty({
    description: 'The last ping timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({ nullable: true })
  last_ping_at: Date;

  @ApiProperty({
    description: 'The engines requiring approval',
    example: '["engine1", "engine2"]',
  })
  @Column('text', { nullable: true })
  engines_require_approval: string;

  @ApiProperty({
    description: 'The color',
    example: '#FF0000',
  })
  @Column({ nullable: true, length: 10 })
  color: string;

  @ApiProperty({
    description: 'The status of the monitor',
    enum: MonitorStatus,
    example: MonitorStatus.CONNECTED,
    enumName: 'MonitorStatus',
  })
  @Column({
    type: 'enum',
    enum: MonitorStatus,
    default: MonitorStatus.UNAVAILABLE,
  })
  status: MonitorStatus;

  @ApiProperty({
    description: 'The serial number',
    example: 'SN123456',
  })
  @Column({ nullable: true, length: 100 })
  sn: string;

  @ApiProperty({
    description: 'The description',
    example: 'Main entrance security camera',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'The timestamp when the monitor was created',
    example: '2024-03-14T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the monitor was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Company, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'company_code', referencedColumnName: 'company_code' })
  company: Company;
}
