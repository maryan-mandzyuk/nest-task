import { ApiProperty } from '@nestjs/swagger/dist';
import { Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 16)
  userName: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 16)
  password: string;
}
