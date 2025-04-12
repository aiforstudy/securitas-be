import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  // @ApiProperty({
  //   description: 'Whether to enable SMS notifications',
  //   example: true,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // sms?: boolean;

  // @ApiProperty({
  //   description: 'Whether to enable email notifications',
  //   example: true,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // email?: boolean;

  // @ApiProperty({
  //   description: 'Whether approval is required',
  //   example: true,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // require_approval?: boolean;

  // @ApiProperty({
  //   description: 'Sequence number format',
  //   example: 'ENG-{YYYYMMDD}-{SEQ}',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // seq_no_format?: string;

  // @ApiProperty({
  //   description: 'Whether to show on home page',
  //   example: true,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // show_on_home?: boolean;

  // @ApiPropertyOptional({
  //   description: 'Engine title',
  //   example: 'Face Detection',
  // })
  // @IsString()
  // @IsOptional()
  // title?: string;

  @ApiPropertyOptional({
    description: 'Related engine ID',
    example: 'engine-002',
  })
  @IsString()
  @IsOptional()
  related_engine?: string;

  @ApiPropertyOptional({
    description: 'Engine icon URL',
    example: 'https://example.com/icon.png',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  // @ApiProperty({
  //   description: 'Whether the engine is enabled',
  //   example: true,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // enable?: boolean;

  // @ApiProperty({
  //   description: 'Learn more URL',
  //   example: 'https://example.com/learn-more',
  //   required: false,
  // })
  // @IsUrl()
  // @IsOptional()
  // learn_more_url?: string;

  // @ApiProperty({
  //   description: 'Engine weight for sorting',
  //   example: 1,
  //   required: false,
  // })
  // @IsInt()
  // @IsOptional()
  // weight?: number;

  @ApiPropertyOptional({
    description: 'Engine color in hex format',
    example: '#FF0000',
  })
  @IsString()
  @IsOptional()
  color?: string;
}
