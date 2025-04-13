import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SmartLockService } from './smartlock.service';
import { CreateSmartLockDto } from './dto/create-smartlock.dto';
import { FindSmartLockDto } from './dto/find-smartlock.dto';
import { SmartLock } from './entities/smartlock.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { SmartLockStatus } from './enums/smartlock-status.enum';

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
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by connection status',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
  })
  @ApiResponse({
    status: 200,
    description: 'Return all smartlocks.',
    type: [SmartLock],
  })
  @Get()
  findAll(@Query('status') status?: SmartLockStatus) {
    return this.smartLockService.findAll(status);
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

  @ApiOperation({ summary: 'Search and paginate smartlocks' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or serial number',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by connection status',
    enum: SmartLockStatus,
    example: SmartLockStatus.CONNECTED,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated smartlocks.',
    type: PaginatedResponseDto<SmartLock>,
  })
  @Get('search')
  async searchAndPaginate(@Query() query: FindSmartLockDto) {
    const result = await this.smartLockService.searchAndPaginate(query);
    return new PaginatedResponseDto<SmartLock>(
      result.items,
      result.total,
      result.page,
      result.limit,
    );
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
