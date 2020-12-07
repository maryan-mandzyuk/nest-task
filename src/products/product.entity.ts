import { ApiProperty } from '@nestjs/swagger';
import { Logs } from 'src/logs/logs.entity';
import { PurchaseItem } from 'src/purchases/entities/purchaseItem.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductPropertyDto } from './dto/product-property.dto';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column()
  price: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: new Date() })
  createdAt: string;

  @ApiProperty()
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({ type: () => [ProductPropertyDto] })
  @Column('json')
  property: ProductPropertyDto[];

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Logs, (log) => log.product)
  logs: Logs[];

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product)
  purchaseItems: PurchaseItem[];
}
