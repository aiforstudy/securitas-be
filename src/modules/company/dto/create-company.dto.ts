import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string = uuidv4();

  @ApiProperty({
    description: 'The name of the company',
    example: 'Acme Corporation',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The unique code of the company',
    example: 'ACME001',
  })
  @IsNotEmpty()
  @IsString()
  company_code: string;

  @ApiProperty({
    description: 'The selected project for the company',
    example: 'Project A',
  })
  @IsOptional()
  @IsString()
  selected_project?: string;

  @ApiProperty({
    description: 'The expiration date of the company',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_on?: Date;

  @ApiProperty({
    description: 'The title of the company',
    example: 'Leading Technology Solutions',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The API key for the company',
    example: 'sk-1234567890abcdef',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  apikey: string;

  @ApiProperty({
    description: 'The URL of the company logo',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  logo_url: string;

  @ApiProperty({
    description: 'The daily report configuration',
    example: '{"enabled": true, "time": "09:00"}',
  })
  @IsOptional()
  @IsString()
  daily_report?: string;

  @ApiProperty({
    description: 'The instant alert configuration',
    example: '{"enabled": true, "channels": ["email", "sms"]}',
  })
  @IsOptional()
  @IsString()
  instant_alert?: string;

  @ApiProperty({
    description: 'The enabled cards configuration',
    example: '["card1", "card2", "card3"]',
  })
  @IsOptional()
  @IsString()
  enabled_cards?: string;

  @ApiProperty({
    description: 'The locale settings for the company',
    example: '{"language": "en", "timezone": "UTC"}',
  })
  @IsOptional()
  @IsObject()
  locale?: Record<string, any>;
}
