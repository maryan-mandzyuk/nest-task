import { Length } from 'class-validator';

export class LoginUserDto {
    @Length(5, 16)
    userName: string;
    
    @Length(5, 16)
    password: string;
}