import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer/decorators';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { LOG_OPERATION } from 'src/constants';
export class FindLogsQueryDto {
  @ApiPropertyOptional({
    enum: LOG_OPERATION,
  })
  @IsOptional()
  @IsIn([LOG_OPERATION])
  operation: string;

  @ApiPropertyOptional({
    minLength: 2,
    maxLength: 25,
  })
  @IsOptional()
  @Length(2, 25)
  dataType: string;

  @ApiPropertyOptional({
    description: 'YYYY-MM-DDTHH:mm:ss',
  })
  @IsOptional()
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'YYYY-MM-DDTHH:mm:ss',
  })
  @IsOptional()
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
