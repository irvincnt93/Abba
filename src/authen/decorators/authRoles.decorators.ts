import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorators';
import { ValidRoles } from '../interfaces/valid-roles';
import { RolesGuard } from '../guard/roles.guard';
import { AuthenGuard } from '../guard/authen.guard';

export function AuthRoles(...roles: ValidRoles[]) {
  return applyDecorators(Roles(...roles), UseGuards(AuthenGuard, RolesGuard));
}
