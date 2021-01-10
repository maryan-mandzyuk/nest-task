import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateWebHookDto } from './dto/create-webHook.dto';
import { WebHookData } from './webHook.entity';

@Injectable()
export class WebHooksService {
  constructor(
    @InjectRepository(WebHookData)
    private readonly webHookRepository: Repository<WebHookData>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public async handleCreate(
    webHookDto: CreateWebHookDto,
    userId: string,
  ): Promise<WebHookData> {
    const user = await this.userRepository.findOneOrFail(userId);

    return this.webHookRepository.save({ ...webHookDto, user });
  }
}
