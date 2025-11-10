import { Injectable } from "@nestjs/common";
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from "src/user/user.service";
// ✅ main.ts에서 require('passport') 쓴 것과 **똑같이** 여기서도 가져온다
const passport = require('passport');


@Injectable()
export class SessionSerializer extends PassportSerializer {

    constructor(private userService: UserService) {
        super();

        // 혹시라도 Nest가 내부적으로 등록 못 한 경우를 대비해서
        // 직접 같은 passport 인스턴스에 바인딩해버린다.
        // (this.serializeUser / this.deserializeUser 를 이 인스턴스에 연결)
        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

    }

    // 세션에 정보를 저장할 때 사용
    // user 정보는 LocalAuthGuard의 canActivate() 메서드에서 super.logIn(request)를 호출할때 내부적으로 request에 있는 user 정보를 꺼내서 전달하면서 serializeUser()를 실행합니다.
    serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
        console.log('serialize >>>', user);

        done(null, user.email); //세션에 저장할 정보
    }

    // 세션에서 정보를 꺼내올때 사용
    // 인증이 되었는지 세션에 있는 정보를 가지고 검증할때 사용합니다.
    // payload는 세션에서 꺼내온 값
    async deserializeUser(payload: any, done: (err: Error | null, payload: any) => void): Promise<any> {
        console.log('deserialize payload >>>', payload);

        // serializeUser()에서 email만 저장했기 때문에 해당 정보가 payload로 전달됩니다.
        // 식별하는데 email만 있으면 되기 때문에 해당하는 유저를 확인할수 있습니다.
        const user = await this.userService.getUser(payload);
        // 유저 정보가 없는 경우 done() 함수에 에러 전달
        if (!user) {
            return done(null, null);
        }
        const { password, ...userInfo } = user;
        // 유저 정보가 있다면 유저 정보 반환
        return done(null, userInfo);

    }
}