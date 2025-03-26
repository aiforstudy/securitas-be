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
import { EngineService } from './engine.service';
import { CreateEngineDto } from './dto/create-engine.dto';
import { UpdateEngineDto } from './dto/update-engine.dto';
import { QueryEngineDto } from './dto/query-engine.dto';
import { Engine } from './entities/engine.entity';
import { PaginatedEngineDto } from './dto/paginated-engine.dto';

@ApiTags('engines')
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new engine' })
  @ApiResponse({
    status: 201,
    description: 'The engine has been successfully created.',
    type: Engine,
  })
  create(@Body() createEngineDto: CreateEngineDto): Promise<Engine> {
    return this.engineService.create(createEngineDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all engines with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return all engines with pagination.',
    type: PaginatedEngineDto,
  })
  findAll(@Query() query: QueryEngineDto): Promise<PaginatedEngineDto> {
    return this.engineService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an engine by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the engine.',
    type: Engine,
  })
  @ApiResponse({
    status: 404,
    description: 'Engine not found.',
  })
  findOne(@Param('id') id: string): Promise<Engine> {
    return this.engineService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an engine' })
  @ApiResponse({
    status: 200,
    description: 'The engine has been successfully updated.',
    type: Engine,
  })
  @ApiResponse({
    status: 404,
    description: 'Engine not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateEngineDto: UpdateEngineDto,
  ): Promise<Engine> {
    return this.engineService.update(id, updateEngineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an engine' })
  @ApiResponse({
    status: 204,
    description: 'The engine has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Engine not found.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.engineService.remove(id);
  }
}
