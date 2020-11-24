import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hashSync, compareSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 
  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }


  public async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async create(userDto: CreateUserDto): Promise<User> {
    const {userName, password } = userDto;
    const user = await this.getUserByUserName(userName);

    if(user) {
      const errors = {username: 'Username must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
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
    const {userName, password } = loginDto;
    const user = await this.getUserByUserName(userName);
    
    if(!user) {
        const errors = {username: 'User does not exist.'};
        throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.UNAUTHORIZED);
      }

    const isEqualPass = compareSync(password, user.password);

    if(!isEqualPass) {
        const errors = {username: 'Wrong password.'};
        throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.UNAUTHORIZED);
    }

    const token = sign(user.id, 'secret');
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const hashPass = await hashSync(password, salt);
    return hashPass;
  }

  private async getUserByUserName(userName: string): Promise<User> {
    const qb = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.userName = :userName', { userName });

    const user = await qb.getOne();
    return user;
  }
}
