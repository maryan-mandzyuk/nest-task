import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from 'src/constants';
import { Repository } from 'typeorm';
import { OauthApp } from '../oauthApp.entity';

@Injectable()
export class UriGuard implements CanActivate {
  constructor(
    @InjectRepository(OauthApp)
    private readonly oauthAppRepository: Repository<OauthApp>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      return this.validateRequest(context);
    } catch (e) {
      throw new HttpException(
        { message: ERROR_MESSAGES.BAD_REQUEST, error: e },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async validateRequest(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const app = await this.oauthAppRepository.findOneOrFail(
      request.query.clientId,
    );

    const uri = `${request.protocol}://${request.headers.host}`;

    return uri === app.uri;
  }
}
