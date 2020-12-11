import { HttpException, HttpStatus } from '@nestjs/common';
import { genSalt, hashSync } from 'bcrypt';
import { decode, verify } from 'jsonwebtoken';
import { appConfig } from '../AppConfig';
import { ERROR_MESSAGES, TOKEN_KEY, TOKEN_TYPES } from '../constants';
import { CustomRequest, ITokenPayload } from './auth.interfaces';

export class AuthHelper {
  static getTokenFromRequest(req: CustomRequest, tokenKey: TOKEN_KEY): string {
    if (tokenKey === TOKEN_KEY.ACTIVATION) {
      const { emailToken } = req.params;
      return emailToken;
    } else {
      const authHeader: string = req.headers[tokenKey];
      const token: string = authHeader.replace('Bearer ', '');
      return token;
    }
  }

  static decodeTokenPayload(token: string): ITokenPayload {
    return decode(token, appConfig.JWT_SECRET) as ITokenPayload;
  }

  static verifyAndDecodeToken(token: string): ITokenPayload {
    return verify(token, appConfig.JWT_SECRET) as ITokenPayload;
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      const hashPass = await hashSync(password, salt);
      return hashPass;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static getTokenHeaderKey(type: TOKEN_TYPES): TOKEN_KEY {
    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return TOKEN_KEY.ACCESS;
      case TOKEN_TYPES.REFRESH:
        return TOKEN_KEY.REFRESH;
      case TOKEN_TYPES.ACTIVATION:
        return TOKEN_KEY.ACTIVATION;
      case TOKEN_TYPES.RESET:
        return TOKEN_KEY.RESET;
      default:
        break;
    }
  }
}
