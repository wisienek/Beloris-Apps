import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ServerRoles } from '@bella/types';
import { LocalStrategy } from '../strategy';
import { RolesGuard } from './dcrole.guard';

export const Auth = (...roles: ServerRoles[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(LocalStrategy, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
