import { ApiProperty } from '@nestjs/swagger';

export class UserPermissionsDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'Company code associated with the user',
    example: 'COMP001',
    required: false,
  })
  company_code?: string;

  @ApiProperty({
    description: 'List of permissions based on role',
    example: ['view_dashboard', 'manage_users', 'manage_companies'],
  })
  permissions: string[];
}
