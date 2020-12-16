import { Module } from '@nestjs/common';
import { OauthAppService } from './oauthApp.service';
import { OauthAppController } from './oauthApp.controller';
import { OauthApp } from './oauthApp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OauthApp, Users])],
  providers: [OauthAppService],
  controllers: [OauthAppController],
})
export class OauthAppModule {}
