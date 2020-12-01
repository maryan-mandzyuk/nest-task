import { decode } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import { TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { CustomRequest, ITokenPayload } from './auth.interfaces';

export class AuthHelper {
  static getTokenFromRequest(req: CustomRequest, tokenKey: TOKEN_KEY): string {
    if (tokenKey === TOKEN_KEY.EMAIL) {
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

  static getTokenHeaderKey(type: TOKEN_TYPES): TOKEN_KEY {
    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return TOKEN_KEY.ACCESS;
      case TOKEN_TYPES.REFRESH:
        return TOKEN_KEY.REFRESH;
      case TOKEN_TYPES.EMAIL:
        return TOKEN_KEY.EMAIL;
      default:
        break;
    }
  }
}
