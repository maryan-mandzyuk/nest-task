import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES } from 'src/constants';
import { Logs } from 'src/logs/logs.entity';
import { Product } from 'src/products/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  userName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  isEmailConfirmed: boolean;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty({ enum: USER_ROLES })
  @Column()
  role: USER_ROLES;

  @ApiProperty()
  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Logs, (log) => log.user)
  logs: Logs[];
}
