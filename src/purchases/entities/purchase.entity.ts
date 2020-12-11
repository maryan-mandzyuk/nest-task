import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PURCHASE_STATUS } from '../../constants';
import { Users } from '../../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseItem } from './purchaseItem.entity';

@Entity()
export class Purchase {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column({ enum: PURCHASE_STATUS })
  status?: PURCHASE_STATUS;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase)
  purchaseItems: PurchaseItem[];

  @ApiPropertyOptional({ type: () => Users })
  @ManyToOne(() => Users, (user) => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
