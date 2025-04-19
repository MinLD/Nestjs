import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Public, ResponseMessage } from 'src/decorator/customize';
import { CodeAuthDto, CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { LocalAuthGuard } from 'src/auth/passport/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailerService: MailerService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard) // ✅ THÊM DÒNG NÀY
  //LocalAuthGuard sẽ:
  //xử lý thông tin từ @Body()

  //kiểm tra username/password

  //gán kết quả user vào req.user
  @Public()
  @ResponseMessage('Login successfully')
  async HandleLogin(@Request() req) {
    return this.authService.login(req.user); // Nếu đúng, trả token
  }

  @Post('/register')
  @Public()
  HandleRegister(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Trả lại thông tin user từ token
  }

  @Get('mail')
  @Public()
  async TestMail() {
    this.mailerService.sendMail({
      to: 'dodangminhluan@gmail.com', // list of receivers
      subject: 'ShopeDoL.com.vn', // Subject line
      text: 'welcome', // plaintext body
      template: 'register.hbs',
      context: {
        name: 'Do Luan',
        activationCode: 123456,
      },
    });

    return 'Oke';
  }

  @Post('/check-code')
  @Public()
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authService.checkCode(codeAuthDto);
  }

  @Post('/resend-code')
  @Public()
  resendCode(@Body('email') email: string) {
    return this.authService.resendCode(email);
  }
}
