import { ApiProperty } from '@nestjs/swagger';
import { Logs } from '../logs/logs.entity';
import { PurchaseItem } from '../purchases/entities/purchaseItem.entity';
import { Users } from '../users/user.entity';
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
  id: string;

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

  @ManyToOne(() => Users, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @OneToMany(() => Logs, (log) => log.product)
  logs?: Logs[];

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product)
  purchaseItems?: PurchaseItem[];
}
