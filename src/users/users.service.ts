import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from 'src/constants';
import { UpdatePasswordUserDto } from './dto/update-password.dto';
import { compare } from 'bcrypt';
import { AuthHelper } from 'src/auth/authHelper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public handleFindById(id: string): Promise<User | never> {
    return this.userRepository.findOneOrFail(id);
  }

  public async handleUserUpdate(
    id: string,
    userDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);

      return this.userRepository.save({ ...user, ...userDto });
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
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      const isPasswordEqual = compare(userDto.oldPassword, user.password);

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

  public handleDelete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
