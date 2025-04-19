import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; //Dùng để load và truy cập biến môi trường (ENV).
import { MongooseModule } from '@nestjs/mongoose'; //Dùng để kết nối với MongoDB thông qua thư viện Mongoose.
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from 'src/core/transform.interceptor';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      //Dùng để cấu hình đọc .env file.
      isGlobal: true, // isGlobal: true nghĩa là ConfigModule có thể dùng ở bất cứ đâu trong ứng dụng mà không cần import lại
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Những module khác mà module này phụ thuộc hoặc sử dụng.
      useFactory: async (configService: ConfigService) => ({
        //Một hàm trả về cấu hình để kết nối MongoDB.
        uri: configService.get<string>('MONGODB_URI'), //Lấy giá trị URI từ biến môi trường (ví dụ .env).
      }),
      inject: [ConfigService], // Nest sẽ inject ConfigService vào useFactory.
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule], // Những module khác mà module này phụ thuộc hoặc sử dụng.
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController], //Khai báo các controller mà module này sử dụng.
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //khai báo GRUAD global để tránh khai báo nhiều lần
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
