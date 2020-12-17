import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthHelper } from 'src/auth/authHelper';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { CreateOauthAppDto } from './dto/create-oauth.dto';
import { QueryOauthAppDto } from './dto/query-oauthApp.dto';
import { OauthApp } from './oauthApp.entity';
import { OauthAppService } from './oauthApp.service';
import { UriGuard } from './guards/uri.guard';
import { SecretGuard } from './guards/secret.guard';

@Controller('oauthApps')
@ApiTags('OauthApps')
export class OauthAppController {
  constructor(private oauthAppService: OauthAppService) {}

  @Post()
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @ApiBearerAuth()
  createWebHook(
    @Request() req,
    @Body() oauthAppDto: CreateOauthAppDto,
  ): Promise<OauthApp> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.oauthAppService.handleCreate(oauthAppDto, userId);
  }

  @Get()
  @UseGuards(UriGuard)
  @UseGuards(new SecretGuard('secret'))
  @ApiQuery({
    type: QueryOauthAppDto,
  })
  authApp(@Query() query: QueryOauthAppDto, @Request() req) {
    return this.oauthAppService.authApp(query, req.headers.secret);
  }

  @Get('/data')
  @UseGuards(new SecretGuard('token'))
  getUserData(@Body() body: { email: string }, @Req() req): Promise<void> {
    return this.oauthAppService.handleFindUser(body.email, req.headers.token);
  }
}
