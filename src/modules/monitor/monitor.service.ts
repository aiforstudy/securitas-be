import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Monitor } from './entities/monitor.entity';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { QueryMonitorDto } from './dto/query-monitor.dto';
import { PaginatedMonitorDto } from './dto/paginated-monitor.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Monitor)
    private readonly monitorRepository: Repository<Monitor>,
  ) {}

  async create(createMonitorDto: CreateMonitorDto): Promise<Monitor> {
    const monitor = this.monitorRepository.create(createMonitorDto);
    return await this.monitorRepository.save(monitor);
  }

  async findAll(query: QueryMonitorDto): Promise<PaginatedMonitorDto> {
    const { page = 1, limit = 10, company_code, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (company_code) {
      where.company_code = company_code;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.monitorRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      total_pages: Number(total_pages),
    };
  }

  async findOne(id: string): Promise<Monitor> {
    const monitor = await this.monitorRepository.findOne({ where: { id } });
    if (!monitor) {
      throw new NotFoundException(`Monitor with ID "${id}" not found`);
    }
    return monitor;
  }

  async update(
    id: string,
    updateMonitorDto: UpdateMonitorDto,
  ): Promise<Monitor> {
    const monitor = await this.findOne(id);
    Object.assign(monitor, updateMonitorDto);
    return await this.monitorRepository.save(monitor);
  }

  async remove(id: string): Promise<void> {
    const monitor = await this.findOne(id);
    await this.monitorRepository.remove(monitor);
  }
}
