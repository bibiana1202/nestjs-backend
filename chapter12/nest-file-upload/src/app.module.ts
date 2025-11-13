import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({ //초기화 함수 실행
      rootPath: join(__dirname, '..', 'uploads'), // 실제 파일이 있는 디렉터리 지정
      serveRoot: '/uploads', // url 뒤에 붙을 경로를 지정
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
