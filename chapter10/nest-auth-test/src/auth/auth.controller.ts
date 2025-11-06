import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { LoginGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    // 회원가입
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.register(userDto);
    }

    // 로그인
    @Post('login')
    async login(@Request() req, @Response() res) {
        const userInfo = await this.authService.validateUser(req.body.email, req.body.password);
        if (userInfo) {
            res.cookie('login', JSON.stringify(userInfo), {
                httpOnly: false, // 브라우저에서 읽을 수 있도록 함
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7day 단위는 밀리초
            });
        }
        return res.send({ message: 'login success' });
    }

    // 로그인
    @UseGuards(LoginGuard)
    @Post('login2')
    async login2(@Request() req, @Response() res) {
        console.log(req);
        console.log('쿠키:', req.cookies['login']);
        console.log('정보:', req.user);
        // 쿠키 정보는 없지만 request 에 user 정보가 있다면 응답값에 쿠키 정보 추가
        if (!req.cookies['login'] && req.user) {
            // 응답에 쿠키 정보 추가
            res.cookie('login', JSON.stringify(req.user), {
                httpOnly: true,
                maxAge: 1000 * 10,
            });
        }
        return res.send({ message: 'login2 success' });
    }

    // 로그인 한 때만 실행되는 메서드
    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard() {
        return '로그인된 때만 이 글이 보입니다.'
    }

}
