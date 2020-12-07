import { ApiProperty } from '@nestjs/swagger';
import { PURCHASE_STATUS } from 'src/constants';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
  purchaseItems?: PurchaseItem[];
}
