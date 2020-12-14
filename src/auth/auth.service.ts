import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { appConfig, emailData } from '../AppConfig';
import {
  CONFIRM_EMAIL_HTML_HANDLER,
  EMAIL_MESSAGES,
  ERROR_MESSAGES,
  RESET_HTML_HANDLER,
  SUCCESS_MESSAGES,
  TOKEN_TYPES,
  USER_REFRESH_TOKEN_KEY,
  USER_ROLES,
} from '../constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Users } from '../users/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { ITokensResponse } from './auth.interfaces';
import { AuthHelper } from './authHelper';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokensResponse } from './TokensResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
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
          HttpStatus.FORBIDDEN,
        );
      }

      if (!user.isEmailConfirmed) {
        throw new HttpException(
          { message: ERROR_MESSAGES.EMAIL_NOT_CONFIRMED },
          HttpStatus.FORBIDDEN,
        );
      }

      const isEqualPass = compareSync(password, user.password);

      if (!isEqualPass) {
        throw new HttpException(
          { message: ERROR_MESSAGES.WRONG_PASSWORD },
          HttpStatus.FORBIDDEN,
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
        HttpStatus.FORBIDDEN,
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

  public async handleCreate(userDto: CreateUserDto): Promise<Users> {
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

      const emailToken = this.handleTokenGenerateByType(
        newUser.id,
        TOKEN_TYPES.ACTIVATION,
      );

      await this.mailerService.sendMail({
        to: email,
        subject: EMAIL_MESSAGES.confirmMessageSubject,
        text: EMAIL_MESSAGES.confirmMessageText,
        html: CONFIRM_EMAIL_HTML_HANDLER(emailData.confirmUrl, emailToken),
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
      return EMAIL_MESSAGES.confirmationMessage;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handelPasswordResetRequest(email: string): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        email,
      });

      const resetToken = this.handleTokenGenerateByType(
        user.id,
        TOKEN_TYPES.RESET,
      );

      await this.mailerService.sendMail({
        to: user.email,
        subject: EMAIL_MESSAGES.confirmMessageSubject,
        text: EMAIL_MESSAGES.confirmMessageText,
        html: RESET_HTML_HANDLER(resetToken),
      });

      return SUCCESS_MESSAGES.RESET_EMAIL_MESSAGE;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async handlePasswordReset(
    token: string,
    resetDto: ResetPasswordDto,
  ): Promise<string> {
    try {
      const { userId } = AuthHelper.decodeTokenPayload(token);
      const user = await this.userRepository.findOneOrFail(userId);

      const hashPass = await AuthHelper.hashPassword(resetDto.newPassword);
      await this.userRepository.save({
        ...user,
        password: hashPass,
      });
      return SUCCESS_MESSAGES.RESET_PASS;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async googleLogin(googleUser): Promise<TokensResponse> {
    let id: string;
    if (!googleUser) {
      throw new HttpException(
        { message: ERROR_MESSAGES.GOOGLE_AUTH },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      const cratedUser: Users = await this.userRepository.save({
        userName: googleUser.lastName,
        isThirdPartyRegister: true,
        isEmailConfirmed: true,
        role: USER_ROLES.seller,
        ...googleUser,
      });
      id = cratedUser.id;
    } else {
      id = user.id;
    }

    const { accessToken, refreshToken } = this.handleTokensGenerate(id);
    const refreshTokenKey = USER_REFRESH_TOKEN_KEY(id);

    const redisClient = await this.redisService.getClient();
    await redisClient.set(refreshTokenKey, refreshToken);

    return { accessToken, refreshToken };
  }

  private handleTokensGenerate(userId: string | number): ITokensResponse {
    const accessToken = sign(
      { userId, type: TOKEN_TYPES.ACCESS },
      appConfig.JWT_SECRET,
      {
        expiresIn: appConfig.ACCESS_TOKEN_EXPIRE,
      },
    );

    const refreshToken = sign(
      { userId, type: TOKEN_TYPES.REFRESH },
      appConfig.JWT_SECRET,
      {
        expiresIn: appConfig.REFRESH_TOKEN_EXPIRE,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  private handleTokenGenerateByType(userId: string, type: TOKEN_TYPES): string {
    const emailToken = sign({ userId, type }, appConfig.JWT_SECRET, {
      expiresIn: appConfig.ACTIVATION_TOKEN_EXPIRE,
    });

    return emailToken;
  }

  private async getUserByUserName(query): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(query)
      .getOne();
  }
}
