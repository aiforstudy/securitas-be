import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { code } });
    if (!role) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }
    return role;
  }

  async findByCode(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { code } });
    if (!role) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { code: createRoleDto.code },
    });

    if (existingRole) {
      throw new BadRequestException(
        `Role with code ${createRoleDto.code} already exists`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(code: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (code === 'admin') {
      throw new BadRequestException('Cannot update admin role');
    }

    const role = await this.findOne(code);

    if (code) {
      const existingRole = await this.roleRepository.findOne({
        where: { code },
      });

      if (existingRole) {
        Object.assign(role, updateRoleDto);
        return this.roleRepository.save(role);
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(code: string): Promise<void> {
    const role = await this.findOne(code);
    await this.roleRepository.remove(role);
  }
}
