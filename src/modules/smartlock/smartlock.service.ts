import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { FindSmartLockDto } from './dto/find-smartlock.dto';
import { SmartLockStatus } from './enums/smartlock-status.enum';

@Injectable()
export class SmartLockService {
  private readonly logger = new Logger(SmartLockService.name);
  constructor(
    @InjectRepository(SmartLock)
    private smartLockRepository: Repository<SmartLock>,
  ) {}

  async create(createSmartLockDto: CreateSmartLockDto): Promise<SmartLock> {
    const smartLock = this.smartLockRepository.create({
      ...createSmartLockDto,
      latest_time: new Date(),
    });
    return this.smartLockRepository.save(smartLock);
  }

  async findAll(
    status?: SmartLockStatus,
    company_code?: string,
  ): Promise<SmartLock[]> {
    const where: FindOptionsWhere<SmartLock> = {};
    if (status) where.status = status;
    if (company_code) where.company_code = company_code;

    return this.smartLockRepository.find({
      where,
      order: {
        latest_time: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<SmartLock> {
    return this.smartLockRepository.findOne({ where: { id } });
  }

  async findBySn(sn: string): Promise<SmartLock> {
    return this.smartLockRepository.findOne({ where: { sn } });
  }

  async update(
    id: string,
    updateSmartLockDto: Partial<CreateSmartLockDto>,
  ): Promise<SmartLock> {
    await this.smartLockRepository.update(id, {
      ...updateSmartLockDto,
      latest_time: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.smartLockRepository.delete(id);
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

    return {
      items,
      total,
      page,
      limit,
    };
  }
}
