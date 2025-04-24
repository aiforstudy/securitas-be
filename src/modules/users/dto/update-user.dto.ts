import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: Role.VIEWER,
    enum: Role,
    required: false,
  })
  @IsString()
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: 'The company code associated with the user',
    example: 'COMP001',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_code?: string;
}
