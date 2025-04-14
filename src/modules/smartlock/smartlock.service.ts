import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { FindSmartLockDto } from './dto/find-smartlock.dto';
import { FindAllSmartLockDto } from './dto/find-all-smartlock.dto';
import { SmartLockStatus } from './enums/smartlock-status.enum';
import { UpdateSmartLockDto } from './dto/update-smartlock.dto';

@Injectable()
export class SmartLockService {
  private readonly logger = new Logger(SmartLockService.name);
  constructor(
    @InjectRepository(SmartLock)
    private readonly smartLockRepository: Repository<SmartLock>,
  ) {}

  async create(createSmartLockDto: CreateSmartLockDto): Promise<SmartLock> {
    const smartLock = this.smartLockRepository.create(createSmartLockDto);
    return this.smartLockRepository.save(smartLock);
  }

  async findAll(findSmartLockDto: FindAllSmartLockDto) {
    const { search, status, company_code } = findSmartLockDto;

    const queryBuilder = this.smartLockRepository
      .createQueryBuilder('smartlock')
      .orderBy('smartlock.created_at', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(smartlock.name LIKE :search OR smartlock.sn LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('smartlock.status = :status', { status });
    }

    if (company_code) {
      queryBuilder.andWhere('smartlock.company_code = :company_code', {
        company_code,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<SmartLock> {
    const smartLock = await this.smartLockRepository.findOne({
      where: { id },
    });

    if (!smartLock) {
      throw new NotFoundException(`Smart lock with ID ${id} not found`);
    }

    return smartLock;
  }

  async findBySn(sn: string): Promise<SmartLock> {
    return this.smartLockRepository.findOne({ where: { sn } });
  }

  async update(
    id: string,
    updateSmartLockDto: UpdateSmartLockDto,
  ): Promise<SmartLock> {
    const smartLock = await this.findOne(id);
    Object.assign(smartLock, updateSmartLockDto);
    return this.smartLockRepository.save(smartLock);
  }

  async remove(id: string): Promise<void> {
    const smartLock = await this.findOne(id);
    await this.smartLockRepository.remove(smartLock);
  }

  async searchAndPaginate(query: FindSmartLockDto) {
    const { search, status, company_code, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<SmartLock>[] = [];

    if (search) {
      where.push({ name: Like(`%${search}%`) }, { sn: Like(`%${search}%`) });
    }

    if (status || company_code) {
      if (where.length > 0) {
        // If we have search conditions, add status and company_code to each condition
        where.forEach((condition) => {
          if (status) condition.status = status;
          if (company_code) condition.company_code = company_code;
        });
      } else {
        // If no search conditions, just add status and company_code condition
        const condition: FindOptionsWhere<SmartLock> = {};
        if (status) condition.status = status;
        if (company_code) condition.company_code = company_code;
        where.push(condition);
      }
    }

    const [items, total] = await this.smartLockRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      skip,
      take: limit,
      order: {
        latest_time: 'DESC',
      },
    });

    this.logger.log(`Found ${total} smartlocks`, items);

    return {
      items,
      total,
      page,
      limit,
    };
  }
}
