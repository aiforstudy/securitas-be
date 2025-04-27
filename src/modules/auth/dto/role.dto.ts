import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The id of the role',
    example: 'admin',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the role',
    example: 'Project admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The permissions of the role',
    example: [
      {
        resource: 'engine',
        actions: ['read', 'create', 'edit', 'delete'],
      },
    ],
  })
  @IsArray()
  permissions: { resource: string; actions: string[] }[];
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Project admin',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The permissions of the role',
    example: [
      {
        resource: 'engine',
        actions: ['read', 'create', 'edit', 'delete'],
      },
    ],
  })
  @IsArray()
  @IsOptional()
  permissions?: { resource: string; actions: string[] }[];
}
