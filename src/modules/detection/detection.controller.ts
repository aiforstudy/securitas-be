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
import { BulkApproveDetectionDto } from './dto/bulk-approve-detection.dto';

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

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get detection statistics by engine' })
  @ApiResponse({
    status: 200,
    description: 'Return detection statistics grouped by engine and time.',
    type: DetectionStatisticsResponseDto,
  })
  getStatistics(
    @Query() query: StatisticsDetectionDto,
  ): Promise<DetectionStatisticsResponseDto> {
    return this.detectionService.getStatistics(
      query.company_code,
      query.from,
      query.to,
      query.timezone,
      query.group_by,
    );
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search detections with advanced filters' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered detections sorted by timestamp.',
    type: PaginatedDetectionDto,
  })
  searchDetections(
    @Query() query: SearchDetectionDto,
  ): Promise<PaginatedDetectionDto> {
    return this.detectionService.searchDetections(query);
  }

  @Post('incoming')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  findOne(@Param('id') id: string): Promise<Detection> {
    return this.detectionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
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
    @Body() updateDetectionDto: UpdateDetectionDto,
  ): Promise<Detection> {
    return this.detectionService.update(id, updateDetectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a detection' })
  @ApiResponse({
    status: 204,
    description: 'The detection has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Detection not found.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.detectionService.remove(id);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a detection' })
  @ApiResponse({
    status: 200,
    description: 'The detection has been successfully approved.',
    type: Detection,
  })
  @ApiResponse({
    status: 404,
    description: 'Detection not found.',
  })
  approveDetection(
    @Param('id') id: string,
    @Body('approved_by') approved_by?: string,
  ): Promise<Detection> {
    return this.detectionService.approveDetection(id, approved_by);
  }

  @Post('approve/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve multiple detections at once' })
  @ApiResponse({
    status: 200,
    description: 'The detections have been successfully approved.',
    type: [Detection],
  })
  @ApiResponse({
    status: 404,
    description: 'One or more detections not found.',
  })
  bulkApproveDetections(
    @Body() bulkApproveDto: BulkApproveDetectionDto,
  ): Promise<Detection[]> {
    return this.detectionService.bulkApproveDetections(bulkApproveDto);
  }
}
