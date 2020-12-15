import { Module } from '@nestjs/common';
import { WebHooksService } from './webHooks.service';
import { WebHooksController } from './webHooks.controller';
import { WebHookData } from './webHook.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebHookData, Users])],
  providers: [WebHooksService],
  controllers: [WebHooksController],
  exports: [WebHooksService],
})
export class WebHooksModule {}
