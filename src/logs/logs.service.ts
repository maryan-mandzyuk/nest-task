import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './logs.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  public async findByUser(
    userId: number,
    operation: string,
    dataType: string,
    startTime: string,
    endTime: string,
    page = 1,
  ): Promise<Logs[]> {
    const logsPerPage = 10;
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
      .skip(logsPerPage * (page - 1))
      .take(logsPerPage)
      .getMany();

    return logs;
  }
}
