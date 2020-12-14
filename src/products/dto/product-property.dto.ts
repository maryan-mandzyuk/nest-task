import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class ProductPropertyDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 250)
  name: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 25)
  value: string;
}
