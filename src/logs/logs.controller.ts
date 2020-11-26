import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  findLogsByUser(@Request() req, @Query() query): Promise<Logs[]> {
    const { userId } = req.user;
    const { operation_type, data_type, start_time, end_time, page } = query;
    return this.logsService.handelFindByUser(
      userId,
      operation_type,
      data_type,
      start_time,
      end_time,
      page,
    );
  }
}
