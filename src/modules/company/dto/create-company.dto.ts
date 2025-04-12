import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

export class CreateCompanyDto {
  @ApiPropertyOptional({
    description: 'Company ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
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

  @ApiPropertyOptional({
    description: 'The selected project for the company',
    example: 'Project A',
  })
  @IsOptional()
  @IsString()
  selected_project?: string;

  @ApiPropertyOptional({
    description: 'The expiration date of the company',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_on?: Date;

  @ApiPropertyOptional({
    description: 'The title of the company',
    example: 'Leading Technology Solutions',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'The API key for the company',
    example: 'sk-1234567890abcdef',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  apikey: string;

  @ApiPropertyOptional({
    description: 'The URL of the company logo',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  logo_url: string;

  @ApiPropertyOptional({
    description: 'The daily report configuration',
    example: '{"enabled": true, "time": "09:00"}',
  })
  @IsOptional()
  @IsString()
  daily_report?: string;

  @ApiPropertyOptional({
    description: 'The instant alert configuration',
    example: '{"enabled": true, "channels": ["email", "sms"]}',
  })
  @IsOptional()
  @IsString()
  instant_alert?: string;

  @ApiPropertyOptional({
    description: 'The enabled cards configuration',
    example: '["card1", "card2", "card3"]',
  })
  @IsOptional()
  @IsString()
  enabled_cards?: string;

  @ApiPropertyOptional({
    description: 'The locale settings for the company',
    example: '{"language": "en", "timezone": "UTC"}',
  })
  @IsOptional()
  @IsObject()
  locale?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'The location coordinates',
    example: '[12.345678,98.765432]',
  })
  @IsOptional()
  @IsString()
  location?: string;
}
