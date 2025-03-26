import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { PaginatedCompanyDto } from './dto/paginated-company.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Check if company_code already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { company_code: createCompanyDto.company_code },
    });

    if (existingCompany) {
      throw new BadRequestException(
        `Company with code ${createCompanyDto.company_code} already exists`,
      );
    }

    // Ensure we have an ID
    const companyData = {
      ...createCompanyDto,
      id: createCompanyDto.id || uuidv4(),
    };

    const company = this.companyRepository.create(companyData);
    return await this.companyRepository.save(company);
  }

  async findAll(query: QueryCompanyDto): Promise<PaginatedCompanyDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.companyRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      data,
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(company_code: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { company_code },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with code ${company_code} not found`,
      );
    }

    return company;
  }

  async update(
    company_code: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // First check if company exists
    await this.findOne(company_code);

    // If company_code is being updated, check if the new code already exists
    if (
      updateCompanyDto.company_code &&
      updateCompanyDto.company_code !== company_code
    ) {
      const existingCompany = await this.companyRepository.findOne({
        where: { company_code: updateCompanyDto.company_code },
      });

      if (existingCompany) {
        throw new BadRequestException(
          `Company with code ${updateCompanyDto.company_code} already exists`,
        );
      }
    }

    // Perform the update
    await this.companyRepository.update(
      { company_code },
      {
        ...updateCompanyDto,
        updated_at: new Date(),
      },
    );

    // Return the updated company
    return await this.findOne(updateCompanyDto.company_code || company_code);
  }

  async remove(company_code: string): Promise<void> {
    const company = await this.findOne(company_code);
    await this.companyRepository.remove(company);
  }

  async getAllCompanies(): Promise<Company[]> {
    return await this.companyRepository.find();
  }
}
