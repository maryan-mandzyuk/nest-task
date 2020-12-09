import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductPurchaseDto } from './product-purchase.dto';
export class CreatePurchaseItemDto {
  @ApiProperty({
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    type: () => [ProductPurchaseDto],
    minItems: 1,
    maxItems: 250,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(250)
  @Type(() => ProductPurchaseDto)
  products: ProductPurchaseDto[];
}
