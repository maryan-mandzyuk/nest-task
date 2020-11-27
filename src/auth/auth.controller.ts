import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { TokensResponse } from './auth.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokensResponse> {
    return this.authService.handleLogin(loginUserDto);
  }

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.handleCreate(createUserDto);
  }

  @Post('/refresh')
  refresh(@Query() query): Promise<TokensResponse> {
    return this.authService.refreshTokens(query['refreshToken']);
  }
}
