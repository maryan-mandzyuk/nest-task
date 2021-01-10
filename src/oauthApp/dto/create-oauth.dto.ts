import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsUrl, Length } from 'class-validator';

export class CreateOauthAppDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 25,
  })
  @Length(1, 25)
  name: string;

  @ApiProperty()
  @IsUrl({ require_tld: false })
  uri: string;

  @ApiProperty()
  @IsUrl({ require_tld: false })
  redirectUri: string;
}
