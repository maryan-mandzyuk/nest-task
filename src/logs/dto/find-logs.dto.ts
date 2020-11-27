import { Type } from 'class-transformer/decorators';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
export class FindLogsQueryDto {
  @IsOptional()
  @IsIn(['insert', 'update', 'delete'])
  operation: string;

  @IsOptional()
  @Length(2, 25)
  dataType: string;

  @IsOptional()
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
