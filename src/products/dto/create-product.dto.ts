import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProductPropertyDto } from './product-property.dto';
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

  @ApiProperty({ type: () => [ProductPropertyDto], minItems: 1, maxItems: 250 })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(250)
  @Type(() => ProductPropertyDto)
  property: ProductPropertyDto[];
}
