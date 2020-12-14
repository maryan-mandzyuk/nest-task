import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LOGS_PER_PAGE } from '../constants';
import { Repository } from 'typeorm';
import { FindLogsQueryDto } from './dto/find-logs.dto';
import { Logs } from './logs.entity';
@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  public async handelFindByUser(
    userId,
    { operation, dataType, startTime, endTime, page = 1 }: FindLogsQueryDto,
  ): Promise<Logs[]> {
    const logs = await this.logsRepository
      .createQueryBuilder('logs')
      .leftJoinAndSelect('logs.product', 'product')
      .where('logs.user_id = :userId', { userId })
      .andWhere(operation ? 'logs.operation_type = :operation' : 'TRUE', {
        operation: operation?.toUpperCase(),
      })
      .andWhere(dataType ? 'logs.data_type = :dataType' : 'TRUE', {
        dataType,
      })
      .andWhere(startTime ? 'logs.createdAt > :startTime' : 'TRUE', {
        startTime,
      })
      .andWhere(endTime ? 'logs.createdAt < :endTime' : 'TRUE', {
        endTime,
      })
      .skip(LOGS_PER_PAGE * (page - 1))
      .take(LOGS_PER_PAGE)
      .getMany();

    return logs;
  }
}
