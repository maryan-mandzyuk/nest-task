import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';
export class UpdatePurchaseItemDto {
  @ApiProperty({
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
