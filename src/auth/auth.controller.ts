import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from 'src/auth/passport/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/login')
  @UseGuards(LocalAuthGuard) // Kích hoạt xác thực username/password
  async HandleLogin(@Request() req) {
    return this.authService.login(req.user); // Nếu đúng, trả token
  }

  @UseGuards(JwtAuthGuard) // Chỉ truy cập nếu có token đúng
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Trả lại thông tin user từ token
  }
}
