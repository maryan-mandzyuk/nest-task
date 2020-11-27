export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenProps {
  userId: string | number;
  userName: string;
}

export interface TokensKey {
  accessTokenKey: string;
  refreshTokenKey: string;
}
