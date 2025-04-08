import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The new role for the user',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;
}
