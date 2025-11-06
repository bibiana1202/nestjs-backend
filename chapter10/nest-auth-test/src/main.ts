import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 전역 파이프에 validationPipe 객체 추가
  app.use(cookieParser()); // 쿠키 파서 설정
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
