import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'viewer',
  })
  @IsString()
  role_id: string;

  @ApiPropertyOptional({
    description: 'The company code associated with the user',
    example: 'COMP001',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_code?: string;
}
