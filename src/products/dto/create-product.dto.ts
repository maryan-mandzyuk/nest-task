import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
export class CreateProductDto {
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
  description?: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 25)
  price: string;
}
