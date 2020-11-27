import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { dbConfig, redisConfig } from './AppConfig';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ProductsModule,
    AuthModule,
    LogsModule,
    RedisModule.register(redisConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
