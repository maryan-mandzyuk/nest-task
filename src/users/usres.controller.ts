import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get('/:id')
    async findAll(@Param() params): Promise<User> {
        return this.usersService.findById(params.id);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) : Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) : Promise<string> {        
        return this.usersService.login(loginUserDto);
    }

    @Delete('/:id')
    async delete(@Param() params) {
        return await this.usersService.delete(params.id);
    }
}