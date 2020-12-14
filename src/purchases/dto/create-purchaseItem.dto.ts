import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class CreatePurchaseItemDto {
  @ApiProperty({
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
