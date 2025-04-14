import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartLockEvent } from './entities/smartlock-event.entity';
import { SmartLock } from './entities/smartlock.entity';
import { CreateSmartLockEventDto } from './dto/create-smartlock-event.dto';
import { FindSmartLockEventDto } from './dto/find-smartlock-event.dto';

@Injectable()
export class SmartLockEventService {
  constructor(
    @InjectRepository(SmartLockEvent)
    private readonly eventRepository: Repository<SmartLockEvent>,
    @InjectRepository(SmartLock)
    private readonly smartLockRepository: Repository<SmartLock>,
  ) {}

  async create(
    createEventDto: CreateSmartLockEventDto,
  ): Promise<SmartLockEvent> {
    // Find the smart lock by serial number
    const smartLock = await this.smartLockRepository.findOne({
      where: { sn: createEventDto.sn },
    });

    if (!smartLock) {
      throw new NotFoundException(
        `Smart lock with SN ${createEventDto.sn} not found`,
      );
    }

    // Create the event
    const event = this.eventRepository.create({
      smartlock: smartLock,
      sn: createEventDto.sn,
      lat: createEventDto.lat,
      lng: createEventDto.lng,
      temperature: createEventDto.temperature,
      humidity: createEventDto.humidity,
      battery_level: createEventDto.battery_level,
    });

    // Update smart lock's latest time
    smartLock.latest_time = new Date();
    await this.smartLockRepository.save(smartLock);

    return this.eventRepository.save(event);
  }

  async findAll(findEventDto: FindSmartLockEventDto) {
    const { page = 1, limit = 10, smartlock_id, sn, from, to } = findEventDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.smartlock', 'smartlock')
      .orderBy('event.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (smartlock_id) {
      queryBuilder.andWhere('event.smartlock_id = :smartlock_id', {
        smartlock_id,
      });
    }

    if (sn) {
      queryBuilder.andWhere('event.sn = :sn', { sn });
    }

    if (from) {
      queryBuilder.andWhere('event.created_at >= :from', { from });
    }

    if (to) {
      queryBuilder.andWhere('event.created_at <= :to', { to });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SmartLockEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['smartlock'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
}
