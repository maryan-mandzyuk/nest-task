import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthHelper } from '../auth/authHelper';
import { TOKEN_KEY, TOKEN_TYPES, USER_ROLES } from '../constants';
import { FindLogsQueryDto } from './dto/find-logs.dto';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';
import { Roles } from '../auth/roles.decorator';

@ApiTags('logs')
@UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
@Roles(USER_ROLES.seller)
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get('')
  @ApiBearerAuth()
  @ApiQuery({
    type: FindLogsQueryDto,
  })
  @ApiResponse({
    status: 200,
    type: [Logs],
  })
  findLogsByUser(
    @Request() req,
    @Query() query: FindLogsQueryDto,
  ): Promise<Logs[]> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.logsService.handelFindByUser(userId, { ...query });
  }
}
