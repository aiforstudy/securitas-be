import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';

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
}
