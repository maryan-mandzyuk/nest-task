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
import { ERROR_MESSAGES, TOKEN_TYPE } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      const token = authHeader.replace('Bearer ', '');
      const tokenPayload = verify(token, appConfig.JWT_SECRET);

      if (tokenPayload['type'] !== TOKEN_TYPE.ACCESS) {
        throw new HttpException(
          ERROR_MESSAGES.TOKEN_INVALID,
          HttpStatus.UNAUTHORIZED,
        );
      }

      request['user'] = tokenPayload;
      return true;
    } catch (e) {
      throw new HttpException(
        ERROR_MESSAGES.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
