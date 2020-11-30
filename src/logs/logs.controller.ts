import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthHelper } from 'src/auth/authHelper';
import { TOKEN_HEADER_KEY, TOKEN_TYPES } from 'src/constants';
import { FindLogsQueryDto } from './dto/find-logs.dto';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(
    private logsService: LogsService,
    private authHelper: AuthHelper,
  ) {}

  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS, new AuthHelper()))
  @Get('')
  findLogsByUser(
    @Request() req,
    @Query() query: FindLogsQueryDto,
  ): Promise<Logs[]> {
    const token = this.authHelper.getTokenFromRequest(
      req,
      TOKEN_HEADER_KEY.ACCESS,
    );
    const { userId } = this.authHelper.decodeTokenPayload(token);
    return this.logsService.handelFindByUser(userId, { ...query });
  }
}
