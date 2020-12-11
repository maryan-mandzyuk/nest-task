import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ID_PARAM, TOKEN_TYPES } from '../constants';
import { AuthGuard } from '../auth/guards/auth.guard';

import { DeleteResult } from 'typeorm';
import { UpdatePasswordUserDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './user.entity';
import { UsersService } from './users.service';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: Users,
    status: 200,
  })
  async findById(@Param() params): Promise<Users> {
    return this.usersService.handleFindById(params.id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @ApiParam(ID_PARAM)
  @ApiResponse({
    status: 200,
  })
  delete(@Param() params): Promise<DeleteResult> {
    return this.usersService.handleDelete(params.id);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @ApiParam(ID_PARAM)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: Users,
  })
  update(@Param() params, @Body() userDto: UpdateUserDto): Promise<Users> {
    return this.usersService.handleUserUpdate(params.id, userDto);
  }

  @Put('/:id/password')
  @UseGuards(new AuthGuard(TOKEN_TYPES.RESET))
  @ApiParam(ID_PARAM)
  @ApiBody({ type: UpdatePasswordUserDto })
  @ApiResponse({
    status: 200,
    type: Users,
  })
  updatePassword(
    @Param() params,
    @Body() userDto: UpdatePasswordUserDto,
  ): Promise<Users> {
    return this.usersService.handlePasswordUpdate(params.id, userDto);
  }
}
