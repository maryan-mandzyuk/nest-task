import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from '../constants';
import { UpdatePasswordUserDto } from './dto/update-password.dto';
import { compare } from 'bcrypt';
import { AuthHelper } from '../auth/authHelper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public handleFindById(id: string): Promise<Users | never> {
    return this.userRepository.findOneOrFail(id);
  }

  public async handleUserUpdate(
    id: string,
    userDto: UpdateUserDto,
  ): Promise<Users> {
    try {
      const user = await this.userRepository.findOneOrFail(id);

      return this.userRepository.save({
        ...user,
        ...userDto,
      });
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async handlePasswordUpdate(
    id: string,
    userDto: UpdatePasswordUserDto,
  ): Promise<Users> {
    try {
      const user = await this.userRepository.findOneOrFail(id, {
        select: ['password'],
      });

      const isPasswordEqual = await compare(userDto.oldPassword, user.password);

      if (!isPasswordEqual) {
        throw new HttpException(
          { message: ERROR_MESSAGES.WRONG_PASSWORD },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const newHashedPassword = await AuthHelper.hashPassword(
        userDto.newPassword,
      );
      return this.userRepository.save({ ...user, password: newHashedPassword });
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public handleDelete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
