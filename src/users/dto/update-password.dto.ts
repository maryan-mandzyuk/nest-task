import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Length } from 'class-validator';

export class UpdatePasswordUserDto {
  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 25)
  oldPassword: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 25)
  newPassword: string;
}
