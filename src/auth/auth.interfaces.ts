import { TOKEN_TYPES } from 'src/constants';

export interface ITokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  type: TOKEN_TYPES;
  userId: string;
}

export interface CustomRequest extends Request {
  params: {
    emailToken: string;
  };
}
