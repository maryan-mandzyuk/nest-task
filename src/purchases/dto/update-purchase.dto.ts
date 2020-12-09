import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { PURCHASE_STATUS } from 'src/constants';
import { UpdatePurchaseItemDto } from './update-purchaseItem.dto';
export class UpdatePurchaseDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    minLength: 5,
    maxLength: 15,
  })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @Length(2, 25)
  address: string;

  @ApiProperty({ enum: PURCHASE_STATUS })
  @IsEnum(PURCHASE_STATUS)
  status: PURCHASE_STATUS;

  @ApiProperty({
    type: () => [UpdatePurchaseItemDto],
    minItems: 1,
    maxItems: 250,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(250)
  @Type(() => UpdatePurchaseItemDto)
  purchaseItem: UpdatePurchaseItemDto[];
}
