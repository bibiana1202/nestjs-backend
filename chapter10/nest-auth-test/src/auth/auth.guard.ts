import { CanActivate, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";



@Injectable()
export class LoginGuard implements CanActivate { // CanActivate 인터페이스 구현 -> 가드

    constructor(private authService: AuthService) { };

    async canActivate(context: any): Promise<boolean> { // CanActivate의 추상 메서드 canActivate()
        // 컨텍스트 에서 리퀘스트 정보를 가져옴
        const request = context.switchToHttp().getRequest(); // context는 ExecuteContext 타입으로 주로 Request나 Response 객체를 얻어오는데 사용
        console.log(request);
        // 쿠키가 있으면 인증 된것
        if (request.cookies['login']) {
            return true;
        }

        // 쿠기가 없으면 request 의 body 정보 확인
        if (!request.body.email || !request.body.password) {
            return false;
        }

        // 인증 로직은 기존의 authServcie.validateUser 사용
        const user = await this.authService.validateUser(request.body.email, request.body.password);
        if (!user) {
            return false;
        }
        request.user = user;
        console.log('정보1:', user);
        return true;
    }
}