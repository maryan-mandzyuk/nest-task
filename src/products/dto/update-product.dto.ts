import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 250,
  })
  @Length(2, 250)
  name: string;

  @ApiPropertyOptional({
    minLength: 2,
    maxLength: 250,
  })
  @IsOptional()
  @Length(2, 250)
  description?: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 250,
  })
  @Length(2, 25)
  price: string;
}
