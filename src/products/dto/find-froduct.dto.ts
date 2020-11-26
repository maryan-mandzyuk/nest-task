import { IsIn, IsOptional, Length, Min } from 'class-validator';
export class FindProductQueryDto {
  @IsOptional()
  page: number;

  @IsOptional()
  @Length(2, 25)
  name: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  orderPrice: 'ASC' | 'DESC';
}
