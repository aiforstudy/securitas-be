import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { FindSmartLockDto } from './dto/find-smartlock.dto';
import { SmartLockStatus } from './enums/smartlock-status.enum';

@Injectable()
export class SmartLockService {
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

  async findAll(status?: SmartLockStatus): Promise<SmartLock[]> {
    const where = status ? { status } : {};
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
    const { search, status, page, limit } = query;
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (search) {
      whereConditions.push(
        { name: Like(`%${search}%`) },
        { sn: Like(`%${search}%`) },
      );
    }

    if (status) {
      whereConditions.push({ status });
    }

    const where = whereConditions.length > 0 ? whereConditions : {};

    const [items, total] = await this.smartLockRepository.findAndCount({
      where,
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
