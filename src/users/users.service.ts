import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hashSync, compareSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';
import { appConfig } from 'src/AppConfig';
import { ERROR_MESSAGES } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findById(id: string): Promise<User | never> {
    return this.userRepository.findOneOrFail(id);
  }

  public async create(userDto: CreateUserDto): Promise<User> {
    const { userName, password } = userDto;
    const user = await this.getUserByUserName(userName);

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

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  public async login(loginDto: LoginUserDto): Promise<string> {
    const { userName, password } = loginDto;
    const user = await this.getUserByUserName(userName);

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
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const hashPass = await hashSync(password, salt);
    return hashPass;
  }

  private async getUserByUserName(userName: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.userName = :userName', { userName })
      .getOne();
  }
}
