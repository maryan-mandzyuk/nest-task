import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ID_PARAM, TOKEN_TYPES } from 'src/constants';
import { DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: User,
    status: 200,
  })
  async findById(@Param() params): Promise<User> {
    return this.usersService.handleFindById(params.id);
  }

  @Delete('/:id')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    status: 200,
  })
  delete(@Param() params): Promise<DeleteResult> {
    return this.usersService.handleDelete(params.id);
  }
}
