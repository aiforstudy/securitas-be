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
    description: 'The RTMP URI for the monitor stream',
    example: 'rtmp://example.com/live/stream1',
  })
  @Column({ nullable: true })
  rtmp_uri: string;

  @ApiProperty({
    description: 'Whether to play from source',
    example: false,
  })
  @Column({ default: false })
  play_from_source: boolean;

  @ApiProperty({
    description: 'The engines configuration as JSON string',
    example: '["engine1", "engine2"]',
  })
  @Column('text')
  engines: string;

  @ApiProperty({
    description: 'Whether recording is enabled',
    example: false,
  })
  @Column({ default: false })
  recording: boolean;

  @ApiProperty({
    description: 'The graph configuration as JSON string',
    example: '{"nodes": [], "edges": []}',
  })
  @Column('text')
  graph: string;

  @ApiProperty({
    description: 'The zone configuration as JSON string',
    example: '{"points": []}',
  })
  @Column('text', { nullable: true })
  zone: string;

  @ApiProperty({
    description: 'The type of monitor',
    example: 'ys',
  })
  @Column({ default: '"ys"', length: 45 })
  type: string;

  @ApiProperty({
    description: 'The device ID',
    example: 'device-123',
  })
  @Column({ nullable: true, length: 45 })
  device_id: string;

  @ApiProperty({
    description: 'The machine ID',
    example: 'machine-123',
  })
  @Column({ nullable: true, length: 45 })
  machine_id: string;

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
  @Column({ default: '1', length: 45 })
  config: string;

  @ApiProperty({
    description: 'The time in',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({ nullable: true })
  time_in: Date;

  @ApiProperty({
    description: 'The time out',
    example: '2024-03-14T23:59:59Z',
  })
  @Column({ nullable: true })
  time_out: Date;

  @ApiProperty({
    description: 'The socket ID',
    example: 'socket-123',
  })
  @Column({ nullable: true, length: 45 })
  socket_id: string;

  @ApiProperty({
    description: 'The YS token',
    example: 'token-123',
  })
  @Column({ nullable: true })
  ys_token: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user-123',
  })
  @Column({ nullable: true, length: 45 })
  user_id: string;

  @ApiProperty({
    description: 'The TNT value',
    example: 0,
  })
  @Column({ type: 'float', default: 0 })
  tnt: number;

  @ApiProperty({
    description: 'The FPT value',
    example: 0,
  })
  @Column({ type: 'float', default: 0 })
  fpt: number;

  @ApiProperty({
    description: 'The CONV value',
    example: 0,
  })
  @Column({ type: 'float', default: 0 })
  conv: number;

  @ApiProperty({
    description: 'The connection URI',
    example: 'rtsp://example.com/stream1',
  })
  @Column({ nullable: true })
  connection_uri: string;

  @ApiProperty({
    description: 'The sub-connection URI',
    example: 'rtsp://example.com/stream2',
  })
  @Column({ nullable: true })
  sub_connection_uri: string;

  @ApiProperty({
    description: 'The snapshot data',
    example: 'base64-encoded-image',
  })
  @Column('text', { nullable: true })
  snapshot: string;

  @ApiProperty({
    description: 'The GPS coordinates',
    example: '10.123456,106.789012',
  })
  @Column({ nullable: true, length: 100 })
  gps_coordinates: string;

  @ApiProperty({
    description: 'The pending engines configuration',
    example: '["engine3", "engine4"]',
  })
  @Column('text', { nullable: true })
  pending_engines: string;

  @ApiProperty({
    description: 'The location',
    example: 'Main Entrance',
  })
  @Column()
  location: string;

  @ApiProperty({
    description: 'The snapshot creation timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({ nullable: true })
  snapshot_created_at: Date;

  @ApiProperty({
    description: 'The handling office',
    example: 'Office A',
  })
  @Column({ nullable: true, length: 100 })
  handling_office: string;

  @ApiProperty({
    description: 'The battery sync status',
    example: true,
  })
  @Column({ nullable: true })
  battery_sync: boolean;

  @ApiProperty({
    description: 'The battery threshold',
    example: 80,
  })
  @Column({ default: 80 })
  battery_threshold: number;

  @ApiProperty({
    description: 'Whether approval is required',
    example: true,
  })
  @Column({ nullable: true })
  require_approval: boolean;

  @ApiProperty({
    description: 'The rule configuration',
    example: '{"conditions": []}',
  })
  @Column('text', { nullable: true })
  rule: string;

  @ApiProperty({
    description: 'The last ping timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({ nullable: true })
  last_ping_at: Date;

  @ApiProperty({
    description: 'The district',
    example: 'District 1',
  })
  @Column({ nullable: true, length: 45 })
  district: string;

  @ApiProperty({
    description: 'Whether approval is not required',
    example: false,
  })
  @Column({ nullable: true })
  dont_require_approval: boolean;

  @ApiProperty({
    description: 'The sequence number format',
    example: 'YYYYMMDD',
  })
  @Column({ nullable: true, length: 45 })
  seq_no_format: string;

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
    description: 'The camera identification',
    example: 'CAM001',
  })
  @Column({ nullable: true, length: 100 })
  camera_identification: string;

  @ApiProperty({
    description: 'The platform device ID',
    example: 'PLAT-123',
  })
  @Column({ nullable: true, length: 100 })
  platform_device_id: string;

  @ApiProperty({
    description: 'The expiry date',
    example: '2024-12-31T23:59:59Z',
  })
  @Column({ nullable: true })
  expiry_date: Date;

  @ApiProperty({
    description: 'Whether the monitor is disabled',
    example: false,
  })
  @Column({ default: false })
  disabled: boolean;

  @ApiProperty({
    description: 'The latest disabled timestamp',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({ nullable: true })
  latest_disabled_at: Date;

  @ApiProperty({
    description: 'The Zabbix host ID',
    example: 'zabbix-123',
  })
  @Column({ nullable: true })
  zabbix_host_id: string;

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

  @Column({ type: 'json', nullable: true })
  configuration: Record<string, any>;
}
