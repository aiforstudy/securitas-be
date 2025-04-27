import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The new role for the user',
    example: 'viewer',
  })
  @IsEnum(Role)
  role_id: string;
}
