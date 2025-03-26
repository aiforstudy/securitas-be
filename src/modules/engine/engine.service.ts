import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Engine } from './entities/engine.entity';
import { CreateEngineDto } from './dto/create-engine.dto';
import { UpdateEngineDto } from './dto/update-engine.dto';
import { QueryEngineDto } from './dto/query-engine.dto';
import { PaginatedEngineDto } from './dto/paginated-engine.dto';

@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(Engine)
    private readonly engineRepository: Repository<Engine>,
  ) {}

  async create(createEngineDto: CreateEngineDto): Promise<Engine> {
    const engine = this.engineRepository.create(createEngineDto);
    return this.engineRepository.save(engine);
  }

  async findAll(query: QueryEngineDto): Promise<PaginatedEngineDto> {
    const { name, show_on_home, enable, page = 1, limit = 10 } = query;

    const where: any = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (show_on_home !== undefined) {
      where.show_on_home = show_on_home;
    }

    if (enable !== undefined) {
      where.enable = enable;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await this.engineRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        name: 'ASC',
      },
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      total_pages,
    };
  }

  async findOne(id: string): Promise<Engine> {
    const engine = await this.engineRepository.findOne({
      where: { id },
    });

    if (!engine) {
      throw new NotFoundException(`Engine with ID ${id} not found`);
    }

    return engine;
  }

  async update(id: string, updateEngineDto: UpdateEngineDto): Promise<Engine> {
    const engine = await this.findOne(id);
    const updatedEngine = Object.assign(engine, updateEngineDto);
    return this.engineRepository.save(updatedEngine);
  }

  async remove(id: string): Promise<void> {
    const engine = await this.findOne(id);
    await this.engineRepository.remove(engine);
  }
}
