import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsUrl } from 'class-validator';

export class CreateWebHookDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 25,
  })
  @IsUrl()
  url: string;
}
