import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('webHookData')
export class WebHookData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column({ name: 'url' })
  url: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: new Date() })
  createdAt: string;

  @ApiProperty({ type: () => Users })
  @ManyToOne(() => Users, (user) => user.webHooks)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
