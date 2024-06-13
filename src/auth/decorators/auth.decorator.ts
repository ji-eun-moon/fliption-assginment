import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(AuthGuard, RoleGuard), ApiCookieAuth());
};
