import {
  IsDateString,
  IsIn,
  IsOptional,
  Length,
  Max,
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
  page: number;
}
