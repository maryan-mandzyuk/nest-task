import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { AuthGuard } from './auth.guard';
import { CustomRequest, TokensResponse } from './auth.interfaces';
import { AuthService } from './auth.service';
import { AuthHelper } from './authHelper';

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
  @UseGuards(new AuthGuard(TOKEN_TYPES.REFRESH))
  refresh(@Req() req: CustomRequest): Promise<TokensResponse> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.REFRESH);
    return this.authService.refreshTokens(token);
  }

  @UseGuards(new AuthGuard(TOKEN_TYPES.EMAIL))
  @Get('/confirm-email/:emailToken')
  confirmEmail(@Param() params): Promise<string> {
    return this.authService.handleEmailConfirmation(params.emailToken);
  }
}
