import { Logs } from 'src/logs/logs.entity';
import { Product } from 'src/products/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
  } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userName: string;
  
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @OneToMany(type => Product, product => product.user)
    products: Product[];

    @OneToMany(type => Logs, log => log.user)
    logs: Logs[];
  }

