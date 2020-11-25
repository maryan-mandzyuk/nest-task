import { Logs } from 'src/logs/logs.entity';
import { User } from 'src/users/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  
  @Entity()
  export class Product {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column()
    name: string;
  
    @Column({nullable: true})
    description: string;

    @Column()
    price: string;

    @Column({ type: 'timestamp', default: new Date()})
    createdAt: string;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(type => User, user => user.products)
    @JoinColumn({name : 'user_id'})
    user: User;

    @OneToMany(type => Logs, log => log.product)
    logs: Logs[];
  }

