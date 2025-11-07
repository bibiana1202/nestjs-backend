import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // PassportStrategy(Strategy)는 믹스인이라고 불리는 방법으로 컴포넌트를 재사용할때 상속을 많이 사용하지만 해당 클래스의 모든 것을 재사용해야 하는 불편함이 있습니다. 클래스의 일부만 확장하고 싶을때는 믹스인을 사용합니다.

    constructor(private authService: AuthService) { super({ usernameField: 'email' }); } // local-strategy에는 인증시 사용하는 필드명이 기본값이 username이므로 email로 변경해줌

    // 유저 정보의 유효성 검증
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        console.log(user);
        if (!user) {
            return null; // null 이면 401 에러 발생
        }
        return user; // null 이 아니면 user 정보 반환
    }
}