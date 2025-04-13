import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SmartLockEventService } from './smartlock-event.service';
import { CreateSmartLockEventDto } from './dto/create-smartlock-event.dto';
import { FindSmartLockEventDto } from './dto/find-smartlock-event.dto';
import { SmartLockEvent } from './entities/smartlock-event.entity';

@ApiTags('Smart Lock Events')
@Controller('smartlock-events')
export class SmartLockEventController {
  constructor(private readonly eventService: SmartLockEventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new smart lock event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The event has been successfully created.',
    type: SmartLockEvent,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Smart lock not found.',
  })
  async create(@Body() createEventDto: CreateSmartLockEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all smart lock events with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all events with pagination.',
    type: SmartLockEvent,
    isArray: true,
  })
  async findAll(@Query() findEventDto: FindSmartLockEventDto) {
    return this.eventService.findAll(findEventDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a smart lock event by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the event.',
    type: SmartLockEvent,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }
}
