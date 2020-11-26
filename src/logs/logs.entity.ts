import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'operation_type' })
  operationType: string;

  @Column({ name: 'data_type' })
  dataType: string;

  @Column({ type: 'timestamp', default: new Date() })
  createdAt: string;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.logs)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
