import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './auth.jwt.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}