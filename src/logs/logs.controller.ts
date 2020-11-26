import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindLogsQueryDto } from './dto/find-logs.dto';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  findLogsByUser(
    @Request() req,
    @Query() query: FindLogsQueryDto,
  ): Promise<Logs[]> {
    const { userId } = req.user;
    return this.logsService.handelFindByUser(userId, { ...query });
  }
}
