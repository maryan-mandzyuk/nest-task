import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSalt, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { appConfig, emailData } from 'src/AppConfig';
import {
  EMAIL_HTML_HANDLER,
  ERROR_MESSAGES,
  TOKEN_TYPES,
  USER_REFRESH_TOKEN_KEY,
} from 'src/constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { ITokensResponse } from './auth.interfaces';
import { AuthHelper } from './authHelper';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  public async handleLogin(loginDto: LoginUserDto): Promise<ITokensResponse> {
    try {
      const { userName, password } = loginDto;
      const user = await this.getUserByUserName({ userName });

      if (!user) {
        throw new HttpException(
          { message: ERROR_MESSAGES.USER_NOT_FOUND },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.isEmailConfirmed) {
        throw new HttpException(
          { message: ERROR_MESSAGES.EMAIL_NOT_CONFIRMED },
          HttpStatus.UNAUTHORIZED,
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
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async refreshTokens(refreshToken: string): Promise<ITokensResponse> {
    try {
      const { userId } = AuthHelper.decodeTokenPayload(refreshToken);

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
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handleCreate(userDto: CreateUserDto): Promise<User> {
    try {
      const { userName, password, email } = userDto;

      const user = await this.getUserByUserName({ userName });

      if (user) {
        throw new HttpException(
          { message: ERROR_MESSAGES.USER_NOT_UNIQUE },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPass = await AuthHelper.hashPassword(password);
      const newUser = await this.userRepository.save({
        ...userDto,
        password: hashPass,
      });

      const emailToken = this.handleEmailTokenGenerate(newUser.id);

      await this.mailerService.sendMail({
        to: email,
        subject: emailData.messageSubject,
        text: emailData.messageText,
        html: EMAIL_HTML_HANDLER(emailData.confirmUrl, emailToken),
      });

      return newUser;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handleEmailConfirmation(emailToken: string): Promise<string> {
    try {
      const { userId } = AuthHelper.decodeTokenPayload(emailToken);
      const user = await this.userRepository.findOneOrFail(userId);
      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      return emailData.confirmationMessage;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private handleTokensGenerate(userId: string | number): ITokensResponse {
    const accessToken = sign(
      { userId, type: TOKEN_TYPES.ACCESS },
      appConfig.JWT_SECRET,
      {
        expiresIn: `${appConfig.ACCESS_TOKEN_EXPIRE_MIN}m`,
      },
    );

    const refreshToken = sign(
      { userId, type: TOKEN_TYPES.REFRESH },
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

  private handleEmailTokenGenerate(userId: number): string {
    const emailToken = sign(
      { userId, type: TOKEN_TYPES.EMAIL },
      appConfig.JWT_SECRET,
      { expiresIn: `${appConfig.EMAIL_TOKEN_EXPIRE_DAY}d` },
    );

    return emailToken;
  }

  private async getUserByUserName(query): Promise<User> {
    return this.userRepository.createQueryBuilder('user').where(query).getOne();
  }
}
