import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public handleFindAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public handleFindById(id: string): Promise<User | never> {
    return this.userRepository.findOneOrFail(id);
  }

  public handleDelete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
