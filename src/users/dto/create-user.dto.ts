import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @Length(5, 16)
  userName: string;

  @Length(5, 16)
  password: string;
}
