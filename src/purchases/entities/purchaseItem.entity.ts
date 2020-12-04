import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Purchase } from './purchase.entity';

@Entity()
export class PurchaseItem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  quantity: string;

  @ApiProperty({ type: () => Purchase })
  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseItems)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product, (product) => product.logs)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
