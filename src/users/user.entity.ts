import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { USER_ROLES } from '../constants';
import { Logs } from '../logs/logs.entity';
import { Product } from '../products/product.entity';
import { Purchase } from '../purchases/entities/purchase.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WebHookData } from 'src/webHooks/webHook.entity';
import { OauthApp } from 'src/oauthApp/oauthApp.entity';

@Entity()
export class Users {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  userName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  isEmailConfirmed: boolean;

  @Column()
  isThirdPartyRegister?: boolean;

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
  @Exclude()
  @Column({ select: false })
  password?: string;

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @OneToMany(() => Logs, (log) => log.user)
  logs?: Logs[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases?: Purchase[];

  @OneToMany(() => WebHookData, (webHook) => webHook.user)
  webHooks?: WebHookData[];

  @OneToMany(() => OauthApp, (oauthApp) => oauthApp.user)
  oauthApps?: OauthApp[];
}
