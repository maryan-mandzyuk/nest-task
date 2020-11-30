import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { TokensResponse } from './auth.interfaces';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './refreshToken.guard';

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

  @Get('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req): Promise<TokensResponse> {
    return this.authService.refreshTokens(req['user']);
  }
}
