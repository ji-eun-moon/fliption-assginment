import { UseGuards, applyDecorators } from '@nestjs/common';
import { OptionalRoleGuard } from '../guards/optional-role.guard';

export const Anonymous = () => {
  return applyDecorators(UseGuards(OptionalRoleGuard));
};
