import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(id: string, pass: string): Promise<any> {
    const user = await this.usersService.findById(id);
    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
