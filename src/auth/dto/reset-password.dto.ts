import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    minLength: 5,
    maxLength: 25,
  })
  @Length(5, 25)
  newPassword: string;
}
