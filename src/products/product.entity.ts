import { ApiProperty } from '@nestjs/swagger';
import { Logs } from 'src/logs/logs.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Logs, (log) => log.product)
  logs: Logs[];
}
