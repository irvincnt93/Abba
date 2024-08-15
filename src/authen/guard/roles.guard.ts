import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride("roles", [
      context.getHandler(),
      context.getClass(),
    ]);    

    // without roles and empty array roles return true
    if (!requiredRoles) return true
    if (requiredRoles.length === 0) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user as User
    if (!user) {
      throw new BadRequestException('User not found')
    }
    // find role user in array roles by Setmetadata
    for (const role of user.roles) {
      if (requiredRoles.includes(role)) {
        return true
      }
    }

    throw new ForbiddenException(`User ${user.name} need a valid role: [${requiredRoles}]`)
    
  }
}
