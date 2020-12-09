import { Product } from 'src/products/product.entity';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreatePurchaseItemDto } from './dto/create-purchaseItem.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchaseItem.entity';

export interface SaveArrayPurchasesProps {
  purchaseDto: CreatePurchaseDto;
  purchaseRepositoryTransaction: Repository<Purchase>;
  purchaseItemRepositoryTransaction: Repository<PurchaseItem>;
  productRepositoryTransaction: Repository<Product>;
  usersRepositoryTransaction: Repository<Users>;
}
export interface SavePurchaseProps {
  purchaseItemDto: CreatePurchaseItemDto;
  purchaseDto: CreatePurchaseDto;
  purchaseRepositoryTransaction: Repository<Purchase>;
  purchaseItemRepositoryTransaction: Repository<PurchaseItem>;
  productRepositoryTransaction: Repository<Product>;
  usersRepositoryTransaction: Repository<Users>;
}
