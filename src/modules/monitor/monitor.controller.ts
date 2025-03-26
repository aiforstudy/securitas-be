import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { QueryMonitorDto } from './dto/query-monitor.dto';
import { Monitor } from './entities/monitor.entity';
import { PaginatedMonitorDto } from './dto/paginated-monitor.dto';

@ApiTags('monitors')
@Controller('monitors')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new monitor' })
  @ApiResponse({
    status: 201,
    description: 'The monitor has been successfully created.',
    type: Monitor,
  })
  create(@Body() createMonitorDto: CreateMonitorDto): Promise<Monitor> {
    return this.monitorService.create(createMonitorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all monitors' })
  @ApiResponse({
    status: 200,
    description: 'Return all monitors.',
    type: PaginatedMonitorDto,
  })
  findAll(@Query() query: QueryMonitorDto): Promise<PaginatedMonitorDto> {
    return this.monitorService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a monitor by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the monitor.',
    type: Monitor,
  })
  @ApiResponse({
    status: 404,
    description: 'Monitor not found.',
  })
  findOne(@Param('id') id: string): Promise<Monitor> {
    return this.monitorService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a monitor' })
  @ApiResponse({
    status: 200,
    description: 'The monitor has been successfully updated.',
    type: Monitor,
  })
  @ApiResponse({
    status: 404,
    description: 'Monitor not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateMonitorDto: UpdateMonitorDto,
  ): Promise<Monitor> {
    return this.monitorService.update(id, updateMonitorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a monitor' })
  @ApiResponse({
    status: 204,
    description: 'The monitor has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Monitor not found.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.monitorService.remove(id);
  }
}
