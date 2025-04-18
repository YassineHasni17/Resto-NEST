import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/users/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Required roles :', requiredRoles);
    console.log('User role :', user.role);
    console.log('Utilisateur dans RolesGuard :', user);

    if (!user) {
      throw new ForbiddenException('Accès interdit : utilisateur non authentifié');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('Has role :', hasRole);
    if (!hasRole) {
      throw new ForbiddenException('Accès interdit : rôle insuffisant');
    }

    return true;
  }
}