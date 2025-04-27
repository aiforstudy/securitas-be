import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/entities/role.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The role of the user',
    type: Role,
  })
  role: Role;

  @Expose()
  @ApiProperty({
    description: 'The company code associated with the user',
    example: 'COMP001',
    required: false,
  })
  company_code?: string;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
