import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer/decorators';
import { IsIn, IsInt, IsOptional, Length, Min } from 'class-validator';
import { ORDER } from 'src/constants';
export class FindProductQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional({
    minLength: 2,
    maxLength: 250,
  })
  @IsOptional()
  @Length(2, 25)
  name: string;

  @ApiPropertyOptional({
    enum: ORDER,
  })
  @IsOptional()
  @IsIn([ORDER])
  orderPrice: ORDER;

  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 25,
  })
  @IsOptional()
  @Length(1, 25)
  searchTerm: string;
}
