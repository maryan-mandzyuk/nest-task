import { IsOptional, Length } from 'class-validator';
export class CreateProductDto {
  @Length(2, 250)
  name: string;

  @IsOptional()
  description: string | null;

  @Length(2, 25)
  price: string;
}
