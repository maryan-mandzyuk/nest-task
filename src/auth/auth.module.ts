import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AuthHelper } from './authHelper';
@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthHelper],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
  exports: [AuthService],
})
export class AuthModule {}
