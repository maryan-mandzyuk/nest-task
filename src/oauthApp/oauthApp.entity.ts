import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('oauthApps')
export class OauthApp {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  uri: string;

  @ApiProperty()
  @Column()
  redirectUri: string;

  @ApiProperty()
  @Column()
  secret: string;

  @ApiProperty({ type: () => Users })
  @ManyToOne(() => Users, (user) => user.oauthApps)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
