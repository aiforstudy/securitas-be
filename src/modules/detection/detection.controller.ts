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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DetectionService } from './detection.service';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { QueryDetectionDto } from './dto/query-detection.dto';
import { Detection } from './entities/detection.entity';
import { PaginatedDetectionDto } from './dto/paginated-detection.dto';
import {
  StatisticsDetectionDto,
  DetectionStatisticsResponseDto,
} from './dto/statistics-detection.dto';
import { SearchDetectionDto } from './dto/search-detection.dto';

@ApiTags('detections')
@Controller('detections')
export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new detection' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The detection has been successfully created.',
  //   type: Detection,
  // })
  // create(@Body() createDetectionDto: CreateDetectionDto): Promise<Detection> {
  //   return this.detectionService.create(createDetectionDto);
  // }

  @Post('incoming')
  @ApiOperation({ summary: 'Create a new detection' })
  @ApiResponse({
    status: 201,
    description: 'The detection has been successfully created.',
    type: Detection,
  })
  createIncomingDetection(
    @Body() createDetectionDto: CreateDetectionDto,
  ): Promise<Detection> {
    return this.detectionService.createIncomingDetection(createDetectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all detections' })
  @ApiResponse({
    status: 200,
    description: 'Return all detections.',
    type: PaginatedDetectionDto,
  })
  findAll(@Query() query: QueryDetectionDto): Promise<PaginatedDetectionDto> {
    return this.detectionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a detection by id and timestamp' })
  @ApiResponse({
    status: 200,
    description: 'Return the detection.',
    type: Detection,
  })
  @ApiResponse({
    status: 404,
    description: 'Detection not found.',
  })
  findOne(
    @Param('id') id: string,
    @Query('timestamp') timestamp: Date,
  ): Promise<Detection> {
    return this.detectionService.findOne(id, timestamp);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a detection' })
  @ApiResponse({
    status: 200,
    description: 'The detection has been successfully updated.',
    type: Detection,
  })
  @ApiResponse({
    status: 404,
    description: 'Detection not found.',
  })
  update(
    @Param('id') id: string,
    @Query('timestamp') timestamp: Date,
    @Body() updateDetectionDto: UpdateDetectionDto,
  ): Promise<Detection> {
    return this.detectionService.update(id, timestamp, updateDetectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a detection' })
  @ApiResponse({
    status: 200,
    description: 'The detection has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Detection not found.',
  })
  remove(
    @Param('id') id: string,
    @Query('timestamp') timestamp: Date,
  ): Promise<void> {
    return this.detectionService.remove(id, timestamp);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get detection statistics by engine' })
  @ApiResponse({
    status: 200,
    description: 'Return detection statistics grouped by engine and time.',
    type: [DetectionStatisticsResponseDto],
  })
  getStatistics(
    @Query() query: StatisticsDetectionDto,
  ): Promise<DetectionStatisticsResponseDto[]> {
    return this.detectionService.getStatistics(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search detections with advanced filters' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered detections sorted by timestamp.',
    type: [Detection],
  })
  searchDetections(@Query() query: SearchDetectionDto): Promise<Detection[]> {
    return this.detectionService.searchDetections(query);
  }
}
