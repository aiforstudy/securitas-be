import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../auth/entities/role.entity';

@Exclude()
export class RoleResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The code of the role',
    example: 'admin',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the role',
    example: 'Administrator',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The permissions of the role',
    example: [
      {
        resource: 'user',
        actions: ['read', 'create', 'edit', 'delete'],
      },
    ],
  })
  permissions: { resource: string; actions: string[] }[];

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the role was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the role was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<Role>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
