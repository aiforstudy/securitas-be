import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('company_notification_settings')
export class CompanyNotificationSetting {
  @ApiProperty({
    description: 'The company ID',
    example: 'company-123',
  })
  @PrimaryColumn({ name: 'company_code' })
  company_code: string;

  @ApiProperty({
    description: 'The Telegram group ID for notifications',
    example: '-1001234567890',
    required: false,
  })
  @Column({ name: 'telegram_group_id', nullable: true })
  telegram_group_id: string;

  @ApiProperty({
    description: 'The Zalo group ID for notifications',
    example: '-1001234567890',
    required: false,
  })
  @Column({ name: 'zalo_group_id', nullable: true })
  zalo_group_id: string;

  @ApiProperty({
    description: 'Whether Telegram notifications are enabled',
    example: true,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  telegram_enabled: boolean;

  @ApiProperty({
    description: 'The timestamp when the settings were created',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the settings were last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
