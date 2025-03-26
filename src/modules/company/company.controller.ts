import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { QueryCompanyDto } from './dto/query-company.dto';
import { PaginatedCompanyDto } from './dto/paginated-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: Company,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all companies with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated companies.',
    type: PaginatedCompanyDto,
  })
  findAll(@Query() query: QueryCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get(':code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a company by code' })
  @ApiResponse({
    status: 200,
    description: 'Return the company.',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found.',
  })
  findOne(@Param('code') code: string) {
    return this.companyService.findOne(code);
  }

  @Patch(':code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found.',
  })
  update(
    @Param('code') code: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(code, updateCompanyDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({
    status: 204,
    description: 'The company has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found.',
  })
  remove(@Param('code') code: string) {
    return this.companyService.remove(code);
  }
}
