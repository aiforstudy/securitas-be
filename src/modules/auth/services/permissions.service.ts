import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS } from '../constants/permissions.const';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getUserPermissions(
    user: User,
  ): Promise<{ resource: string; actions: string[] }[]> {
    const role = await this.roleRepository.findOne({
      where: { code: user.role },
    });
    return role?.permissions || [];
  }

  async hasPermission(
    user: User,
    permission: string | { resource: string; actions: string[] },
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(user);

    if (typeof permission === 'string') {
      // Handle string permission format (e.g., 'users.view')
      const [resource, action] = permission.split('.');
      return userPermissions.some(
        (p) => p.resource === resource && p.actions.includes(action),
      );
    } else {
      // Handle object permission format
      return userPermissions.some(
        (p) =>
          p.resource === permission.resource &&
          permission.actions.every((action) => p.actions.includes(action)),
      );
    }
  }

  async hasAnyPermission(
    user: User,
    permissions: (string | { resource: string; actions: string[] })[],
  ): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.hasPermission(user, permission)) {
        return true;
      }
    }
    return false;
  }

  async hasAllPermissions(
    user: User,
    permissions: (string | { resource: string; actions: string[] })[],
  ): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.hasPermission(user, permission))) {
        return false;
      }
    }
    return true;
  }

  async checkResourcePermission(
    user: User,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(user);
    return userPermissions.some(
      (p) => p.resource === resource && p.actions.includes(action),
    );
  }

  async getAllPermissions(): Promise<typeof PERMISSIONS> {
    return PERMISSIONS;
  }
}
