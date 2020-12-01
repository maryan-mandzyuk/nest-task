import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column({ name: 'operation_type' })
  operationType: string;

  @ApiProperty()
  @Column({ name: 'data_type' })
  dataType: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: new Date() })
  createdAt: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product, (product) => product.logs)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
