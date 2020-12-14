import { ApiProperty } from '@nestjs/swagger';
import { ITokensResponse } from './auth.interfaces';

export class TokensResponse implements ITokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
