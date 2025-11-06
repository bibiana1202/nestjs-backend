import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServie = app.get(ConfigService);
  const port = configServie.get("SERVER_PORT");
  await app.listen(port);
}
bootstrap();
