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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ID_PARAM, TOKEN_TYPES } from 'src/constants';
import { DeleteResult } from 'typeorm';
import { UpdatePasswordUserDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  @Put('/:id')
  @ApiParam(ID_PARAM)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: User,
  })
  update(@Param() params, @Body() userDto: UpdateUserDto): Promise<User> {
    return this.usersService.handleUserUpdate(params.id, userDto);
  }

  @Put('/:id/password')
  @ApiParam(ID_PARAM)
  @ApiBody({ type: UpdatePasswordUserDto })
  @ApiResponse({
    status: 200,
    type: User,
  })
  updatePassword(
    @Param() params,
    @Body() userDto: UpdatePasswordUserDto,
  ): Promise<User> {
    return this.usersService.handlePasswordUpdate(params.id, userDto);
  }
}
