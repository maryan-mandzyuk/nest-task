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
import { ERROR_MESSAGES, TOKEN_TYPES } from 'src/constants';
import { CustomRequest, ITokenPayload } from './auth.interfaces';
import { AuthHelper } from './authHelper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenType: TOKEN_TYPES) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: CustomRequest = context
        .switchToHttp()
        .getRequest() as CustomRequest;

      const tokenHeaderKey = AuthHelper.getTokenHeaderKey(this.tokenType);
      const token = AuthHelper.getTokenFromRequest(request, tokenHeaderKey);
      const tokenPayload = verify(token, appConfig.JWT_SECRET) as ITokenPayload;

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
