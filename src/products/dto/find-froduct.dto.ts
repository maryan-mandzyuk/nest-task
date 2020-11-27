import { Type } from 'class-transformer/decorators';
import { IsIn, IsInt, IsOptional, Length, Min } from 'class-validator';
export class FindProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Length(2, 25)
  name: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  orderPrice: 'ASC' | 'DESC';
}
