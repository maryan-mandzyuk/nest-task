import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthHelper } from 'src/auth/authHelper';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, AuthHelper],
  controllers: [ProductsController],
  providers: [ProductsService, AuthHelper],
  exports: [ProductsService],
})
export class ProductsModule {}
