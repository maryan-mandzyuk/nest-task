import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Users } from 'src/users/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CustomRequest, ITokensResponse } from './auth.interfaces';
import { AuthService } from './auth.service';
import { AuthHelper } from './authHelper';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokensResponse } from './TokensResponse';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    type: TokensResponse,
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<ITokensResponse> {
    return this.authService.handleLogin(loginUserDto);
  }

  @Post('/register')
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    type: Users,
    status: 200,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.authService.handleCreate(createUserDto);
  }

  @Get('/refresh-token')
  @UseGuards(new AuthGuard(TOKEN_TYPES.REFRESH))
  @ApiResponse({
    status: 200,
    type: TokensResponse,
  })
  refresh(@Req() req: CustomRequest): Promise<ITokensResponse> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.REFRESH);
    return this.authService.refreshTokens(token);
  }

  @Get('/confirm-email/:emailToken')
  @ApiParam({ type: 'string', name: 'emailToken' })
  @ApiResponse({
    status: 200,
    type: TokensResponse,
  })
  confirmEmail(@Param() params): Promise<string> {
    return this.authService.handleEmailConfirmation(params.emailToken);
  }

  @Get('/resetPassword/:email')
  @ApiParam({ type: 'string', name: 'email' })
  @ApiResponse({
    status: 200,
  })
  requestForPasswordReset(@Param() params): Promise<string> {
    return this.authService.handelPasswordResetRequest(params.email);
  }

  @Post('/resetPassword')
  @UseGuards(new AuthGuard(TOKEN_TYPES.RESET))
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
  })
  resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @Req() req: CustomRequest,
  ): Promise<string> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.RESET);
    return this.authService.handlePasswordReset(token, resetDto);
  }
}
