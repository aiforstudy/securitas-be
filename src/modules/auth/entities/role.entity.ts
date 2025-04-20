import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({
    description: 'The code of the role',
    example: 'admin',
  })
  @PrimaryColumn()
  code: string;

  @ApiProperty({
    description: 'The name of the role',
    example: 'Project admin',
  })
  @Column()
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
  @Column('json')
  permissions: { resource: string; actions: string[] }[];

  @ApiProperty({
    description: 'The timestamp when the role was created',
    example: '2024-03-14T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the role was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
