import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Length } from 'class-validator';

export class UpdateUserDto {
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
}
