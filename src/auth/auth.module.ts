import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/passport/local.strategy';
import { JwtStrategy } from 'src/auth/passport/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      //registerAsync: Cho phép truyền cấu hình động (ví dụ đọc từ .env)
      useFactory: async (configService: ConfigService) => ({
        global: true,
        // useFactory Hàm dùng để tạo cấu hình JWT
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
        //Lấy JWT_SECRET và JWT_ACCESS_TOKEN_EXPIRED từ .env qua ConfigService
      }),
      inject: [ConfigService],
      //inject: Nói với NestJS rằng bạn muốn tiêm (inject) ConfigService vào useFactory
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
