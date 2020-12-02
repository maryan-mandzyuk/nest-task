import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProductPropertyDto } from './product-property.dto';

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

  @ApiProperty({ type: () => [ProductPropertyDto], minItems: 1, maxItems: 250 })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMinSize(250)
  @Type(() => ProductPropertyDto)
  property: ProductPropertyDto[];
}
