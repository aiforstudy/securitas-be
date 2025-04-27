import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'hashed_password',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @Column()
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiProperty({
    description: 'The company code associated with the user',
    example: 'COMP001',
  })
  @Column({ nullable: true })
  company_code: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2024-03-14T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
