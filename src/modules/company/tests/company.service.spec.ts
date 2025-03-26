import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../company.service';
import { Company } from '../entities/company.entity';
import { NotFoundException } from '@nestjs/common';
import { QueryCompanyDto } from '../dto/query-company.dto';

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: Repository<Company>;

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a company', async () => {
      const createCompanyDto = {
        name: 'Test Company',
        company_code: 'TEST001',
        apikey: 'test-api-key',
        logo_url: 'https://example.com/logo.png',
      };

      mockRepository.create.mockReturnValue(mockCompany);
      mockRepository.save.mockResolvedValue(mockCompany);

      const result = await service.create(createCompanyDto);

      expect(result).toEqual(mockCompany);
      expect(mockRepository.create).toHaveBeenCalledWith(createCompanyDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCompany);
    });
  });

  describe('findAll', () => {
    it('should return paginated companies with default values', async () => {
      const query: QueryCompanyDto = {};
      const mockCompanies = [mockCompany];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([mockCompanies, total]);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: mockCompanies,
        page: 1,
        limit: 10,
        total,
        total_pages: 1,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: {
          created_at: 'DESC',
        },
      });
    });

    it('should return paginated companies with custom values', async () => {
      const query: QueryCompanyDto = {
        page: 2,
        limit: 5,
      };
      const mockCompanies = [mockCompany];
      const total = 7;

      mockRepository.findAndCount.mockResolvedValue([mockCompanies, total]);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: mockCompanies,
        page: 2,
        limit: 5,
        total,
        total_pages: 2,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        order: {
          created_at: 'DESC',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompany);

      const result = await service.findOne(mockCompany.id);

      expect(result).toEqual(mockCompany);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
    });

    it('should throw NotFoundException when company is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto = {
        name: 'Updated Company',
      };

      const updatedCompany = { ...mockCompany, ...updateCompanyDto };

      mockRepository.findOne.mockResolvedValue(mockCompany);
      mockRepository.save.mockResolvedValue(updatedCompany);

      const result = await service.update(mockCompany.id, updateCompanyDto);

      expect(result).toEqual(updatedCompany);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent company', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'Updated Company' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompany);
      mockRepository.remove.mockResolvedValue(mockCompany);

      await service.remove(mockCompany.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCompany);
    });

    it('should throw NotFoundException when removing non-existent company', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
