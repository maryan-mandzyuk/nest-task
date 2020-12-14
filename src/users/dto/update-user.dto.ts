import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 25)
  firstName: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 25)
  lastName: string;

  @ApiProperty({
    minLength: 4,
    maxLength: 25,
  })
  @Length(4, 25)
  userName: string;
}
