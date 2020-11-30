import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES, TOKEN_TYPES } from 'src/constants';
import { AuthHelper } from './authHelper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenType: TOKEN_TYPES, private authHelper: AuthHelper) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const tokenHeaderKey = this.authHelper.getTokenHeaderKey(this.tokenType);
      const token = this.authHelper.getTokenFromRequest(
        request,
        tokenHeaderKey,
      );

      const tokenPayload = this.authHelper.decodeTokenPayload(token);

      if (tokenPayload.type !== this.tokenType) {
        throw new HttpException(
          ERROR_MESSAGES.TOKEN_INVALID,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return true;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.TOKEN_INVALID, error: e },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
