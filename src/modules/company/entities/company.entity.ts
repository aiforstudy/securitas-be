import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('companies')
export class Company {
  @ApiProperty({
    description: 'The unique identifier of the company',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'Acme Corporation',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'The unique code of the company',
    example: 'ACME001',
  })
  @Column({ unique: true })
  company_code: string;

  @ApiPropertyOptional({
    description: 'The selected project for the company',
    example: 'Project A',
  })
  @Column({ nullable: true })
  selected_project: string;

  @ApiPropertyOptional({
    description: 'The expiration date of the company',
    example: '2024-12-31T23:59:59.999Z',
  })
  @Column({ nullable: true })
  expires_on: Date;

  @ApiPropertyOptional({
    description: 'The title of the company',
    example: 'Leading Technology Solutions',
  })
  @Column({ nullable: true, length: 145 })
  title: string;

  @ApiPropertyOptional({
    description: 'The API key for the company',
    example: 'sk-1234567890abcdef',
  })
  @Column({ length: 145 })
  apikey: string;

  @ApiPropertyOptional({
    description: 'The URL of the company logo',
    example: 'https://example.com/logo.png',
  })
  @Column({ length: 1000 })
  logo_url: string;

  @ApiPropertyOptional({
    description: 'The daily report configuration',
    example: '{"enabled": true, "time": "09:00"}',
  })
  @Column({ type: 'text', nullable: true })
  daily_report: string;

  @ApiPropertyOptional({
    description: 'The instant alert configuration',
    example: '{"enabled": true, "channels": ["email", "sms"]}',
  })
  @Column({ type: 'text', nullable: true })
  instant_alert: string;

  @ApiPropertyOptional({
    description: 'The enabled cards configuration',
    example: '["card1", "card2", "card3"]',
  })
  @Column({ type: 'text', nullable: true })
  enabled_cards: string;

  @ApiPropertyOptional({
    description: 'The locale settings for the company',
    example: '{"language": "en", "timezone": "UTC"}',
  })
  @Column({ type: 'json', nullable: true })
  locale: Record<string, any>;

  @ApiPropertyOptional({
    description: 'The location',
    example: '[12.345678,98.765432]',
  })
  @Column({ type: 'json', nullable: true })
  location: string;

  @ApiProperty({
    description: 'The timestamp when the company was created',
    example: '2024-03-14T07:54:27.478Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the company was last updated',
    example: '2024-03-14T07:54:27.478Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
