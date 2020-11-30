import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthHelper } from 'src/auth/authHelper';
import { LogsController } from './logs.controller';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logs]), AuthHelper],
  controllers: [LogsController],
  providers: [LogsService, AuthHelper],
  exports: [LogsService],
})
export class LogsModule {}
