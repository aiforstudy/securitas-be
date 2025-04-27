import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ... existing code ...

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if the new role is different from the current role
    if (user.role.id === updateRoleDto.role_id) {
      throw new ConflictException(
        `User already has role ${updateRoleDto.role_id}`,
      );
    }

    user.role_id = updateRoleDto.role_id;
    return this.userRepository.save(user);
  }
}
