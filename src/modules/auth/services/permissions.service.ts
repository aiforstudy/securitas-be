import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class PermissionsService {
  private readonly rolePermissions: Record<Role, string[]> = {
    [Role.ADMIN]: [
      // Dashboard
      'dashboard.view',
      'dashboard.statistics.view',
      'dashboard.alerts.view',

      // User Management
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',

      // Company Management
      'companies.view',
      'companies.create',
      'companies.edit',
      'companies.delete',

      // Monitor Management
      'monitors.view',
      'monitors.create',
      'monitors.edit',
      'monitors.delete',
      'monitors.stream.start',
      'monitors.stream.stop',

      // Engine Management
      'engines.view',
      'engines.create',
      'engines.edit',
      'engines.delete',

      // Detection Management
      'detections.view',
      'detections.details.view',
      'detections.export',

      // Settings
      'settings.view',
      'settings.edit',

      // Reports
      'reports.view',
      'reports.generate',
      'reports.export',
    ],
    [Role.USER]: [
      // Dashboard
      'dashboard.view',
      'dashboard.statistics.view',
      'dashboard.alerts.view',

      // Monitor Management
      'monitors.view',
      'monitors.stream.start',
      'monitors.stream.stop',

      // Detection Management
      'detections.view',
      'detections.details.view',
      'detections.export',

      // Reports
      'reports.view',
      'reports.export',
    ],
    [Role.VIEWER]: [
      // Dashboard
      'dashboard.view',
      'dashboard.statistics.view',

      // Monitor Management
      'monitors.view',

      // Detection Management
      'detections.view',
      'detections.details.view',

      // Reports
      'reports.view',
    ],
  };

  getUserPermissions(user: User): string[] {
    return this.rolePermissions[user.role] || this.rolePermissions[Role.VIEWER];
  }

  hasPermission(user: User, permission: string): boolean {
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.includes(permission);
  }

  hasAnyPermission(user: User, permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions(user);
    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  hasAllPermissions(user: User, permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions(user);
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
