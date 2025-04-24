import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Company } from '../entities/company.entity';

@Exclude()
export class CompanyResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the company',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The code of the company',
    example: 'COMP001',
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the company',
    example: 'Company Name',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The address of the company',
    example: '123 Street, City, Country',
  })
  address: string;

  @Expose()
  @ApiProperty({
    description: 'The phone number of the company',
    example: '+1234567890',
  })
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'The email of the company',
    example: 'company@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the company',
    example: 'active',
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the company was created',
    example: '2024-03-14T00:00:00Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The timestamp when the company was last updated',
    example: '2024-03-14T00:00:00Z',
  })
  updated_at: Date;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}
