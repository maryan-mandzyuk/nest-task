import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { decode, sign } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import { ERROR_MESSAGES } from 'src/constants';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateOauthAppDto } from './dto/create-oauth.dto';
import { QueryOauthAppDto } from './dto/query-oauthApp.dto';
import { OauthApp } from './oauthApp.entity';

@Injectable()
export class OauthAppService {
  constructor(
    @InjectRepository(OauthApp)
    private readonly oauthAppRepository: Repository<OauthApp>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async handleCreate(
    oauthAppDto: CreateOauthAppDto,
    userId: string,
  ): Promise<OauthApp> {
    const secret = sign({ name: oauthAppDto.name }, appConfig.OAUTH_SECRET);
    return this.oauthAppRepository.save({
      ...oauthAppDto,
      user: { id: userId },
      secret,
    });
  }

  public async authApp(query: QueryOauthAppDto, secret: string) {
    try {
      const app = await this.oauthAppRepository.findOneOrFail(query.clientId);
      if (app.secret !== secret) {
        throw new HttpException(
          { message: ERROR_MESSAGES.TOKEN_INVALID },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const accessToken = sign({ clientId: app.id }, appConfig.OAUTH_SECRET, {
        expiresIn: appConfig.OAUTH_SECRET_EXPIRE,
      });

      return { accessToken, state: query.state };
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.BAD_REQUEST, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handleFindUser(email: string, token: string): Promise<void> {
    const user = await this.usersRepository.findOneOrFail(email);
    const { clientId } = decode(token) as { clientId: string };

    const app = await this.oauthAppRepository.findOneOrFail(clientId);
    const { firstName, lastName, userName } = user;
    axios.post(app.redirectUri, { firstName, lastName, userName, email });
  }
}
