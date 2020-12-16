import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { appConfig } from 'src/AppConfig';
import { ERROR_MESSAGES } from '../../constants';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { token } = request.headers;

      verify(token, appConfig.OAUTH_SECRET);

      return true;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.TOKEN_INVALID, error: e },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
