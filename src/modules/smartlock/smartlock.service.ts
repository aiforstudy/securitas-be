import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { FindSmartLockDto } from './dto/find-smartlock.dto';

@Injectable()
export class SmartLockService {
  constructor(
    @InjectRepository(SmartLock)
    private smartLockRepository: Repository<SmartLock>,
  ) {}

  async create(createSmartLockDto: CreateSmartLockDto): Promise<SmartLock> {
    const smartLock = this.smartLockRepository.create(createSmartLockDto);
    return this.smartLockRepository.save(smartLock);
  }

  async findAll(): Promise<SmartLock[]> {
    return this.smartLockRepository.find();
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
    await this.smartLockRepository.update(id, updateSmartLockDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.smartLockRepository.delete(id);
  }

  async searchAndPaginate(query: FindSmartLockDto) {
    const { search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? [{ name: Like(`%${search}%`) }, { sn: Like(`%${search}%`) }]
      : {};

    const [items, total] = await this.smartLockRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
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
