import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SmartLockService } from './smartlock.service';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { SmartLock } from './entities/smartlock.entity';

@ApiTags('SmartLocks')
@Controller('smartlocks')
export class SmartLockController {
  constructor(private readonly smartLockService: SmartLockService) {}

  @ApiOperation({ summary: 'Create a new smartlock' })
  @ApiResponse({
    status: 201,
    description: 'The smartlock has been successfully created.',
    type: SmartLock,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  create(@Body() createSmartLockDto: CreateSmartLockDto) {
    return this.smartLockService.create(createSmartLockDto);
  }

  @ApiOperation({ summary: 'Get all smartlocks' })
  @ApiResponse({
    status: 200,
    description: 'Return all smartlocks.',
    type: [SmartLock],
  })
  @Get()
  findAll() {
    return this.smartLockService.findAll();
  }

  @ApiOperation({ summary: 'Get a smartlock by id' })
  @ApiParam({
    name: 'id',
    description: 'Smartlock ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the smartlock.',
    type: SmartLock,
  })
  @ApiResponse({ status: 404, description: 'Smartlock not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.smartLockService.findOne(id);
  }

  @ApiOperation({ summary: 'Get a smartlock by serial number' })
  @ApiParam({
    name: 'sn',
    description: 'Smartlock Serial Number',
    example: 'SL-123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the smartlock.',
    type: SmartLock,
  })
  @ApiResponse({ status: 404, description: 'Smartlock not found.' })
  @Get('sn/:sn')
  findBySn(@Param('sn') sn: string) {
    return this.smartLockService.findBySn(sn);
  }

  @ApiOperation({ summary: 'Update a smartlock' })
  @ApiParam({
    name: 'id',
    description: 'Smartlock ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The smartlock has been successfully updated.',
    type: SmartLock,
  })
  @ApiResponse({ status: 404, description: 'Smartlock not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSmartLockDto: Partial<CreateSmartLockDto>,
  ) {
    return this.smartLockService.update(id, updateSmartLockDto);
  }

  @ApiOperation({ summary: 'Delete a smartlock' })
  @ApiParam({
    name: 'id',
    description: 'Smartlock ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The smartlock has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Smartlock not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.smartLockService.remove(id);
  }
}
