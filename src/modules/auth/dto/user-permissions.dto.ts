import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class PermissionRequirement {
  resource: string;
  actions: string[];
}

export class UserPermissionsDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The role of the user',
  })
  role: Role;

  @ApiProperty({
    description: 'The company code associated with the user',
    example: 'COMP001',
    required: false,
  })
  company_code?: string;

  @ApiProperty({
    description: 'The permissions of the user',
    example: [
      {
        resource: 'detection',
        actions: ['read', 'create', 'edit', 'delete'],
      },
    ],
    type: [PermissionRequirement],
  })
  permissions: PermissionRequirement[];
}
