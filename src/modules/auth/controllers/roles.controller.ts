import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get()
  @Permissions('role.read')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Returns all roles',
    type: [Role],
  })
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Permissions('role.read')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all permissions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
          desc: { type: 'string' },
          actions: {
            type: 'array',
            items: { type: 'string' },
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getPermissions() {
    return this.permissionsService.getAllPermissions();
  }

  @Get(':code')
  @Permissions('role.read')
  @ApiOperation({ summary: 'Get a role by code' })
  @ApiResponse({
    status: 200,
    description: 'Returns the role',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('code') code: string): Promise<Role> {
    return this.rolesService.findOne(code);
  }

  @Post()
  @Permissions('role.create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':code')
  @Permissions('role.edit')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('code') code: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(code, updateRoleDto);
  }

  // @Delete(':code')
  // @Permissions('role.delete')
  // @ApiOperation({ summary: 'Delete a role' })
  // @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  // @ApiResponse({ status: 404, description: 'Role not found' })
  // async remove(@Param('code') code: string): Promise<void> {
  //   return this.rolesService.remove(code);
  // }
}
