import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Length } from 'class-validator';

export class QueryOauthAppDto {
  @ApiProperty()
  @Length(5, 50)
  clientId: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 50,
  })
  @Length(5, 50)
  state: string;
}
