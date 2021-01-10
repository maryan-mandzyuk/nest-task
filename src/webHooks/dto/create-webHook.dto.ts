import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsUrl } from 'class-validator';

export class CreateWebHookDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}
