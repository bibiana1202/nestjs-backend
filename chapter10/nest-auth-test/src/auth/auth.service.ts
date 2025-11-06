import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService) { };

    // 회원 가입 ~
    async register(userDto: CreateUserDto) {
        // 이미 가입된 유저가 있는지 체크
        const user = await this.userService.getUser(userDto.email);
        if (user) {
            throw new HttpException('해당 유저가 이미 있습니다.', HttpStatus.BAD_REQUEST,);
        }

        // 패스워드 암호화
        const encryptedPassword = bcrypt.hashSync(userDto.password, 10);

        // 데이터베이스에 저장. 저장중 에러가 나면 서버 에러 발생
        try {
            const user = await this.userService.createUser({
                ...userDto,
                password: encryptedPassword,
            });
            // 회원가입 후 반환하는 값에는 password를 주지 않음
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (e) {
            throw new HttpException('서버 에러', 500);
        }
    }

    async validateUser(email: string, password: string) {
        // 이메일로 유저 정보를 받아옴
        const user = await this.userService.getUser(email);
        if (!user) { // 유저 없으면 검증 실패
            return null;
        }
        const { password: hashedPassword, ...userInfo } = user;
        // 패스워드 따로 뽑아냄
        if (bcrypt.compareSync(password, hashedPassword)) { // 패스워드 일치하면 성공
            return userInfo;
        }
        return null;

    }
}
