import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../company.controller';
import { CompanyService } from '../company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { QueryCompanyDto } from '../dto/query-company.dto';
import { PaginatedCompanyDto } from '../dto/paginated-company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;

  const mockCompany = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Company',
    company_code: 'TEST001',
    selected_project: 'Project A',
    expires_on: new Date(),
    title: 'Test Title',
    apikey: 'test-api-key',
    logo_url: 'https://example.com/logo.png',
    daily_report: '{"enabled": true, "time": "09:00"}',
    instant_alert: '{"enabled": true, "channels": ["email"]}',
    enabled_cards: '["card1", "card2"]',
    locale: { language: 'en', timezone: 'UTC' },
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPaginatedResponse: PaginatedCompanyDto = {
    data: [mockCompany],
    page: 1,
    limit: 10,
    total: 1,
    total_pages: 1,
  };

  const mockCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        company_code: 'TEST001',
        apikey: 'test-api-key',
        logo_url: 'https://example.com/logo.png',
      };

      mockCompanyService.create.mockResolvedValue(mockCompany);

      const result = await controller.create(createCompanyDto);

      expect(result).toEqual(mockCompany);
      expect(mockCompanyService.create).toHaveBeenCalledWith(createCompanyDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated companies with default values', async () => {
      const query: QueryCompanyDto = {};
      mockCompanyService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockCompanyService.findAll).toHaveBeenCalledWith(query);
    });

    it('should return paginated companies with custom values', async () => {
      const query: QueryCompanyDto = {
        page: 2,
        limit: 5,
      };
      const customResponse: PaginatedCompanyDto = {
        ...mockPaginatedResponse,
        page: 2,
        limit: 5,
        total: 7,
        total_pages: 2,
      };
      mockCompanyService.findAll.mockResolvedValue(customResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(customResponse);
      expect(mockCompanyService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      mockCompanyService.findOne.mockResolvedValue(mockCompany);

      const result = await controller.findOne(mockCompany.id);

      expect(result).toEqual(mockCompany);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(mockCompany.id);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
      };

      const updatedCompany = { ...mockCompany, ...updateCompanyDto };
      mockCompanyService.update.mockResolvedValue(updatedCompany);

      const result = await controller.update(mockCompany.id, updateCompanyDto);

      expect(result).toEqual(updatedCompany);
      expect(mockCompanyService.update).toHaveBeenCalledWith(
        mockCompany.id,
        updateCompanyDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      await controller.remove(mockCompany.id);

      expect(mockCompanyService.remove).toHaveBeenCalledWith(mockCompany.id);
    });
  });
});
