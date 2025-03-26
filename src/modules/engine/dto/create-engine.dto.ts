import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsInt, IsUrl } from 'class-validator';

export class CreateEngineDto {
  @ApiProperty({
    description: 'Engine ID',
    example: 'engine-001',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Engine name',
    example: 'Face Detection Engine',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether to enable SMS notifications',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  sms?: boolean;

  @ApiProperty({
    description: 'Whether to enable email notifications',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @ApiProperty({
    description: 'Whether approval is required',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  require_approval?: boolean;

  @ApiProperty({
    description: 'Sequence number format',
    example: 'ENG-{YYYYMMDD}-{SEQ}',
    required: false,
  })
  @IsString()
  @IsOptional()
  seq_no_format?: string;

  @ApiProperty({
    description: 'Whether to show on home page',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  show_on_home?: boolean;

  @ApiProperty({
    description: 'Engine title',
    example: 'Face Detection',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Related engine ID',
    example: 'engine-002',
    required: false,
  })
  @IsString()
  @IsOptional()
  related_engine?: string;

  @ApiProperty({
    description: 'Engine icon URL',
    example: 'https://example.com/icon.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Whether the engine is enabled',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @ApiProperty({
    description: 'Learn more URL',
    example: 'https://example.com/learn-more',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  learn_more_url?: string;

  @ApiProperty({
    description: 'Engine weight for sorting',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Engine color in hex format',
    example: '#FF0000',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}
