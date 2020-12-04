import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { USER_ROLES } from 'src/constants';

export class CreateUserDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(5, 25)
  firstName: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(5, 25)
  lastName: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 25)
  userName: string;

  @ApiProperty({
    enum: USER_ROLES,
  })
  @IsEnum(USER_ROLES)
  role: USER_ROLES;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 25)
  password: string;
}
