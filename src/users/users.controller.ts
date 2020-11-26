import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  async findAll(@Param() params): Promise<User> {
    return this.usersService.handleFindById(params.id);
  }

  @Delete('/:id')
  delete(@Param() params) {
    return this.usersService.handleDelete(params.id);
  }
}
