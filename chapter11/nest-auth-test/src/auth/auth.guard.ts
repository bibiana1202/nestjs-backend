import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from '@nestjs/passport'; // 패스포트를 사용하는 AuthGuard 임포트 -> 패스포트 인증에 가드를 사용할 수 있도록 감싸둔 AuthGuard를 제공하는 라이브러리
import { Observable } from "rxjs";


@Injectable()
export class LoginGuard implements CanActivate { // CanActivate 인터페이스 구현 -> 가드

    constructor(private authService: AuthService) { };

    async canActivate(context: any): Promise<boolean> { // CanActivate의 추상 메서드 canActivate()
        // 컨텍스트 에서 리퀘스트 정보를 가져옴
        const request = context.switchToHttp().getRequest(); // context는 ExecuteContext 타입으로 주로 Request나 Response 객체를 얻어오는데 사용

        // 1) 쿠키에 login이 있으면 이미 로그인된 걸로 간주
        const loginCookie = request.cookies?.['login'];
        if (loginCookie) {
            // 필요하면 여기서 JSON.parse해서 request.user에 넣어도됨
            try {
                request.user = JSON.parse(loginCookie);
            } catch (e) {
                // 쿠키가 깨졌으면 그냥 통과 안시킴
                return false;
            }
            return true;
        }

        // 2) 쿠키가 없으면 -> 이번 요청이 "로그인 시도"인지 확인(email,password 존재?)
        const { email, password } = request.body || {};
        if (!email || !password) {
            // 바디도 없으면 로그인 안된 상태
            return false;
        }
        // 3) 바디가 있으면 실제 유저 확인
        // 인증 로직은 기존의 authServcie.validateUser 사용
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            return false;
        }

        // 여기까지 왔으면 이번 요청에서는 로그인 성공 한거니까
        // 컨트롤러에서 쿠키 심을 수 있도록 request.user에 넣어둠
        request.user = user;
        return true;
    }
}

// 로그인 시 사용할 가드
// AuthGuard 상속 , AuthGuard('local')은 로컬 스트래티지를 사용
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: any): Promise<boolean> {
        // Passport Local 전략 자동 실행
        // 1. passport.authenticate('local') 미들웨어가 실행됨
        // 2. 그 안에서 LocalStrategy.validate()가 호출됨
        // 3. validate() 가 return한 값(user)을 가지고 내부적으로 req.user = user; 를 자동으로 해줌
        const result = (await super.canActivate(context)) as boolean; // => LocalStrategy
        console.log('1', result);
        // Nest는 ExecutionContext라는 추상화 계층을 쓰기 때문에, HTTP 요청 객체(req)를 꺼내려면 이렇게 변환해야함
        const request = context.switchToHttp().getRequest(); // 로컬스트래티지 실행
        console.log('2');
        // 1. 내부적으로 req.login(req.user)를 호출해
        // 2. Passport가 serializeUser()를 실행해서 세션에 req.user 정보를 저장해둠,
        if (request.user) { // 로그인에 성공한 경우에만 세션에 user를 태운다            
            console.log('3');
            await super.logIn(request); // => serializeUser
        }

        // canActivate()는 boolean을 반환해야 하니까, 로그인 성공여부를 그대로 리턴해서 가드 통과
        return result;
    }
}

// 로그인 후 인증 되었는지 확인할때 사용
// 세션에 데이터를 저장하고 돌려주는 응답(response)값에 connect.sid라는 쿠키를 만들게 됩니다.
// 이후의 요청에 해당 쿠키값을 같이 전송하면 세션에 있는 값을 읽어서 인증 여부를 확인할때 사용 하는 가드 입니다.
@Injectable()
export class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated(); // 세션에서 정보를 읽어서 인증 확인        
    }
}

// google 스트래티지 사용
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    async canActivate(context: any): Promise<boolean> {
        // 부모 클래스의 메서드 사용
        const result = (await super.canActivate(context)) as boolean;
        // 컨텍스트에서 리퀘스트 객체를 꺼냄, nestjs에서는 context에서 리퀘스트 객체를 꺼낼수 있습니다.
        const request = context.switchToHttp().getRequest();
        // 세션 적용
        await super.logIn(request);
        return result;

    }
}