import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// CJS 모듈이라 헷갈릴 때는 require로 가져오면
// Nest 내부가 쓰는 passport 인스턴스랑 똑같은 걸 쓰게 된다.
const passport = require('passport');

async function bootstrap() {
  // app.use 는 이 미들웨어를 모든 요청에 적용하라 라는 뜻임 !!
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 전역 파이프에 validationPipe 객체 추가
  app.use(cookieParser()); // 쿠키 파서 설정
  app.use(
    session({
      secret: 'very-importan-secret', // 세션 암호화에 사용되는 키
      resave: false, // 세션을 항상 저장할지 여부 -> HTTP 요청이 올때마다 세션을 새로 저장하면 효율이 떨어질 수있으므로 false로 해둡니다.
      saveUninitialized: false, // 세션이 저장되기 전에는 초기화되지 않은 상태로 세션을 미리 만들어 저장 -> 세션이 저장되기 전에 빈값을 저장할지 여부를 나타냅니다. 인증이 되지 않은 사용자 정보도 빈값으로 저장하므로 false로 설정해 불필요한 공간을 차지 하지 않게 했습니다.
      cookie: { maxAge: 3600000 }, // 쿠키 유효기간 1시간 -> 세션을 찾는데 사용할 키값을 쿠키에 설정합니다.
    }),
  );
  // 여기서 사용하는 passport는 위에서 require로 가져온 그 passport이고,
  // Nest의 SessionSerializer도 같은 passport 인스턴스에 등록된다.
  // 그래서 이제 serialize/deserialize 둘 다 같은 놈이 담당하게 된다.
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
