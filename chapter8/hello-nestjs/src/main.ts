import { NestFactory } from "@nestjs/core";
import { HelloModule } from "./hello.module";

// NestJS를 시작시키는 함수
async function bootstrap() {
    const app = await NestFactory.create(HelloModule);  // NestFactory 를 사용해서 NestApplication 객체 생성
    await app.listen(3000, () => { console.log("서버 시작 !") }); // 3000번 포트로 서버 가동
}

bootstrap();