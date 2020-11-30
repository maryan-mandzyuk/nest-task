import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSalt, hashSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import {
  ERROR_MESSAGES,
  TOKEN_TYPE,
  USER_REFRESH_TOKEN_KEY,
} from 'src/constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { TokensResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  public async handleLogin(loginDto: LoginUserDto): Promise<TokensResponse> {
    try {
      const { userName, password } = loginDto;
      const user = await this.getUserByUserName({ userName });

      if (!user) {
        throw new HttpException(
          { message: ERROR_MESSAGES.USER_NOT_FOUND },
          HttpStatus.NOT_FOUND,
        );
      }

      const isEqualPass = compareSync(password, user.password);

      if (!isEqualPass) {
        throw new HttpException(
          { message: ERROR_MESSAGES.WRONG_PASSWORD },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const redisClient = await this.redisService.getClient();

      const { accessToken, refreshToken } = this.handleTokensGenerate(user.id);

      const refreshTokenKey = USER_REFRESH_TOKEN_KEY(user.id);

      await redisClient.set(refreshTokenKey, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SEVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    try {
      const user = verify(refreshToken, appConfig.JWT_SECRET);
      const userId = user['userId'];

      const refreshTokenKey = USER_REFRESH_TOKEN_KEY(userId);

      const redisClient = await this.redisService.getClient();
      const oldRefreshToken = await redisClient.get(refreshTokenKey);

      if (oldRefreshToken !== refreshToken) {
        throw new HttpException(
          { message: ERROR_MESSAGES.TOKEN_INVALID },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const {
        accessToken: newAccess,
        refreshToken: newRefresh,
      } = this.handleTokensGenerate(userId);

      await redisClient.set(refreshTokenKey, newRefresh);

      return {
        refreshToken: newRefresh,
        accessToken: newAccess,
      };
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SEVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handleCreate(userDto: CreateUserDto): Promise<User> {
    const { userName, password } = userDto;
    const user = await this.getUserByUserName({ userName });

    if (user) {
      throw new HttpException(
        { message: ERROR_MESSAGES.USER_NOT_UNIQUE },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPass = await this.hashPassword(password);

    return await this.userRepository.save({
      ...userDto,
      password: hashPass,
    });
  }

  private handleTokensGenerate(userId: string | number): TokensResponse {
    const accessToken = sign(
      { userId, type: TOKEN_TYPE.ACCESS },
      appConfig.JWT_SECRET,
      {
        expiresIn: `${appConfig.ACCESS_TOKEN_EXPIRE_MIN}m`,
      },
    );

    const refreshToken = sign(
      { userId, type: TOKEN_TYPE.REFRESH },
      appConfig.JWT_SECRET,
      {
        expiresIn: `${appConfig.REFRESH_TOKEN_EXPIRE_MIN}m`,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      const hashPass = await hashSync(password, salt);
      return hashPass;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SEVER_ERROR, error: e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getUserByUserName(query): Promise<User> {
    return this.userRepository.createQueryBuilder('user').where(query).getOne();
  }
}