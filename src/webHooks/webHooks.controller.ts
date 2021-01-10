import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthHelper } from 'src/auth/authHelper';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TOKEN_KEY, TOKEN_TYPES, USER_ROLES } from 'src/constants';
import { CreateWebHookDto } from './dto/create-webHook.dto';
import { WebHookData } from './webHook.entity';
import { WebHooksService } from './webHooks.service';

@Controller('webHooks')
@ApiTags('WebHooks')
export class WebHooksController {
  constructor(private webHookService: WebHooksService) {}

  @Post('')
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
  @ApiBearerAuth()
  @ApiResponse({
    type: WebHookData,
    status: 200,
  })
  createWebHook(
    @Body() webHookDto: CreateWebHookDto,
    @Request() req,
  ): Promise<WebHookData> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.webHookService.handleCreate(webHookDto, userId);
  }
}
