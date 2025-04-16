import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config'; //Dùng để load và truy cập biến môi trường (ENV).
import { MongooseModule } from '@nestjs/mongoose'; //Dùng để kết nối với MongoDB thông qua thư viện Mongoose.
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [AppController], //Khai báo các controller mà module này sử dụng.
  providers: [AppService], //Khai báo các service (hoặc provider) mà module này cần.
})
export class AppModule {}
