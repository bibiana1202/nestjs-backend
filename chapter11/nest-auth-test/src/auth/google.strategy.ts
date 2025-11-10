import { Injectable } from "@nestjs/common";
import { Profile, Strategy } from "passport-google-oauth20";
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";

// PassportStrategy(Strategy) 상속
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    // 부모 클래스의 생성자를 호출
    constructor(private userService: UserService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!, // 클라이언트 ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // 시크릿
            callbackURL: 'http://localhost:3000/auth/google', // 콜백 URL
            scope: ['email', 'profile'], // scope
        });
    }

    // OAuth 인증이 끝나고 콜백으로 실행되는 메서드
    // 인증의 유효성 검증
    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const { id, name, emails } = profile;
        console.log(accessToken);
        console.log(refreshToken);

        const providerId = id;
        const email = emails?.[0]?.value ?? '';

        // 유저 정보 저장 혹은 가져오기
        const fullName = (name?.familyName ?? '') + (name?.givenName ?? '');
        const user: User = await this.userService.findByEmailOrSave(email, fullName, providerId);

        return user;
        // console.log(providerId, email, name?.familyName, name?.givenName);
        // return profile;
    }
}