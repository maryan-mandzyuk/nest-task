import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { UsersController } from './users/usres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';


@Module({
  imports: [TypeOrmModule.forRoot(),
  UsersModule,
  ProductsModule,
  AuthModule,
  LogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  