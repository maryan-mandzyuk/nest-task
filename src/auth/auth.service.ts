import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSalt, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import { ERROR_MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async handleLogin(loginDto: LoginUserDto): Promise<string> {
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

      const token = sign(user.id.toString(), appConfig.JWT_SECRET);
      return token;
    } catch (e) {
      throw e;
    }
  }

  public async handleCreate(userDto: CreateUserDto): Promise<User> {
    const { userName, password } = userDto;
    const user = await this.getUserByUserName({ userName });

    if (user) {
      throw new HttpException(
        { message: ERROR_MESSAGES.USER_NOT_UNIQE },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPass = await this.hashPassword(password);

    return await this.userRepository.save({
      ...userDto,
      password: hashPass,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      const hashPass = await hashSync(password, salt);
      return hashPass;
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SEVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getUserByUserName(query): Promise<User> {
    return this.userRepository.createQueryBuilder('user').where(query).getOne();
  }
}
