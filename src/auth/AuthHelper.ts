import { decode } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import { TOKEN_HEADER_KEY, TOKEN_TYPES } from 'src/constants';
import { ITokenPayload } from './auth.interfaces';

export class AuthHelper {
  static getTokenFromRequest(
    req: Request,
    tokenHeader: TOKEN_HEADER_KEY,
  ): string {
    const authHeader: string = req.headers[tokenHeader];
    const token: string = authHeader.replace('Bearer ', '');
    return token;
  }

  static decodeTokenPayload(token: string): ITokenPayload {
    return decode(token, appConfig.JWT_SECRET) as ITokenPayload;
  }

  static getTokenHeaderKey(type: TOKEN_TYPES): TOKEN_HEADER_KEY {
    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return TOKEN_HEADER_KEY.ACCESS;
      case TOKEN_TYPES.REFRESH:
        return TOKEN_HEADER_KEY.REFRESH;
      default:
        break;
    }
  }
}
