import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalStrategy } from '../strategy';

export const Auth = (...roles) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(LocalStrategy),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
};
