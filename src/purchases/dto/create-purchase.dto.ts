import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { Users } from '../../users/user.entity';
import { CreatePurchaseItemDto } from './create-purchaseItem.dto';
export class CreatePurchaseDto {
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

  @ApiPropertyOptional({ type: () => Users })
  @IsOptional()
  @Type(() => Users)
  user: Users;

  @ApiProperty({
    type: () => [CreatePurchaseItemDto],
    minItems: 1,
    maxItems: 250,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(250)
  @Type(() => CreatePurchaseItemDto)
  purchaseItems: CreatePurchaseItemDto[];
}
