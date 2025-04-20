import { SetMetadata } from '@nestjs/common';

export interface PermissionRequirement {
  resource: string;
  actions: string[];
}

export const Permissions = (
  ...permissions: (string | PermissionRequirement)[]
) => SetMetadata('permissions', permissions);
