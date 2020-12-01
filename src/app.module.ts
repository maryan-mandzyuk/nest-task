import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { dbConfig, emailConfig, redisConfig } from './AppConfig';
import { RedisModule } from 'nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ProductsModule,
    AuthModule,
    LogsModule,
    RedisModule.register(redisConfig),
    MailerModule.forRoot(emailConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
