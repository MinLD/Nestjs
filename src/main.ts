import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); //NestJS sử dụng hệ thống Dependency Injection,
  // nên bạn có thể "lấy" (get) một provider đã khai báo (ở đây là ConfigService).
  //ConfigService đã được khai báo là global trong AppModule
  // nên bạn có thể dùng ở đây luôn.
  const port = configService.get('PORT'); //Lấy giá trị PORT từ file .env hoặc hệ thống biến môi trường.

  app.setGlobalPrefix('api/v1', {
    exclude: [''],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //sẽ bỏ những thông tin thừa khi người dùng truyền với request.
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port);
  //Lệnh này sẽ khởi động server và lắng nghe kết nối HTTP trên port đó.Ví dụ: http://localhost:3000
}
bootstrap();
