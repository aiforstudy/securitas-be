import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Engine } from './entities/engine.entity';
import { CreateEngineDto } from './dto/create-engine.dto';
import { UpdateEngineDto } from './dto/update-engine.dto';
import { QueryEngineDto } from './dto/query-engine.dto';
import { PaginatedEngineDto } from './dto/paginated-engine.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(Engine)
    private readonly engineRepository: Repository<Engine>,
  ) {}

  async create(createEngineDto: CreateEngineDto): Promise<Engine> {
    // Check if engine with provided ID already exists
    if (createEngineDto.id) {
      const existingEngine = await this.engineRepository.findOne({
        where: { id: createEngineDto.id },
      });

      if (existingEngine) {
        throw new BadRequestException(
          `Engine with ID ${createEngineDto.id} already exists`,
        );
      }
    }

    // Ensure we have an ID
    const engineData = {
      ...createEngineDto,
      id: createEngineDto.id || uuidv4(),
    };

    const engine = this.engineRepository.create(engineData);
    return await this.engineRepository.save(engine);
  }

  async findAll(query: QueryEngineDto): Promise<PaginatedEngineDto> {
    const { name, page = 1, limit = 10 } = query;

    const where: any = {};

    if (name) {
      where.name = Like(`%${name}%`);
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
    // First check if engine exists
    await this.findOne(id);

    // If ID is being updated, check if the new ID already exists
    if (updateEngineDto.id && updateEngineDto.id !== id) {
      const existingEngine = await this.engineRepository.findOne({
        where: { id: updateEngineDto.id },
      });

      if (existingEngine) {
        throw new BadRequestException(
          `Engine with ID ${updateEngineDto.id} already exists`,
        );
      }
    }

    // Perform the update
    await this.engineRepository.update(
      { id },
      {
        ...updateEngineDto,
        updated_at: new Date(),
      },
    );

    // Return the updated engine
    return await this.findOne(updateEngineDto.id || id);
  }

  async remove(id: string): Promise<void> {
    const engine = await this.findOne(id);
    await this.engineRepository.remove(engine);
  }

  async getAllEngines(): Promise<Engine[]> {
    return await this.engineRepository.find();
  }
}
