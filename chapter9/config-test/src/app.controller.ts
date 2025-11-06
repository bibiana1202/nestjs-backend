import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) { }

  @Get()
  getHello(): string {
    const message = this.configService.get('MESSAGE');
    console.log(message);
    return message;
  }

  @Get('service-url')
  getServiceUrl(): string {
    const message = this.configService.get('SERVICE_URL');
    console.log(message);
    return message;
  }

  @Get('db-info')
  getTest(): string {
    console.log(this.configService.get('logLevel'));
    console.log(this.configService.get('apiVersion'));
    const message = this.configService.get('dbInfo');
    return message;
  }

  @Get('redis-info')
  getRedisInfo(): string {
    return `${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`;
  }

  @Get('server-url')
  getServerUrl(): string {
    const message = this.configService.get('SERVER_URL');
    return message;
  }
}
