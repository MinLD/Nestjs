import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CodeAuthDto, CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { comparePasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },

      access_token: this.jwtService.sign(payload),
    };
  }

  register = async (createAuthDto: CreateAuthDto) => {
    return await this.usersService.HandleRegister(createAuthDto);
  };

  async checkCode(codeAuthDto: CodeAuthDto) {
    return await this.usersService.ActiveAccount(codeAuthDto);
  }

  async resendCode(email: string) {
    return await this.usersService.RetryActive(email);
  }
}
