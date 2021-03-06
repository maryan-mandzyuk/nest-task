import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchaseItem.entity';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseItem, Product])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
