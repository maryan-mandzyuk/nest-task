import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TOKEN_TYPES } from '../../constants';
import { UsersService } from '../../users/users.service';
import { AuthHelper } from '../authHelper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const tokenHeaderKey = AuthHelper.getTokenHeaderKey(TOKEN_TYPES.ACCESS);
    const token = AuthHelper.getTokenFromRequest(request, tokenHeaderKey);
    const tokenPayload = AuthHelper.verifyAndDecodeToken(token);
    const user = await this.usersService.handleFindById(tokenPayload.userId);

    return roles.includes(user.role);
  }
}
