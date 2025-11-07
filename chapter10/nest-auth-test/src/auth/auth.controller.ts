import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthenticatedGuard, LocalAuthGuard, LoginGuard } from './auth.guard';
import type { Request, Response } from 'express';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    // 회원가입
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.register(userDto);
    }

    // 로그인
    // @Post('login')
    // async login(@Request() req, @Response() res) {
    //     const userInfo = await this.authService.validateUser(req.body.email, req.body.password);
    //     if (userInfo) {
    //         res.cookie('login', JSON.stringify(userInfo), {
    //             httpOnly: false, // 브라우저에서 읽을 수 있도록 함
    //             maxAge: 1000 * 60 * 60 * 24 * 7, // 7day 단위는 밀리초
    //         });
    //     }
    //     return res.send({ message: 'login success' });
    // }


    // 로그인
    @UseGuards(LoginGuard)
    @Post('login2')
    async login2(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // 여기 들어왔단 건 가드에서 이미
        // 1) 쿠키가 있었거나
        // 2) 바디(email,password)로 인증이 됐거나 둘중 하나라는 뜻

        // 가드에서 request.user에 넣어줬다면
        // -> 이번 요청이 "처음 로그인"한 경우이므로 쿠키를 심어줌
        if (!req.cookies['login'] && (req as any).user) {
            res.cookie('login', JSON.stringify((req as any).user), {
                httpOnly: true,
                maxAge: 1000 * 10,
            });
        }

        // 여기서는 Express로 res.send() 하지 말고
        // Nest가 응답하도록 객체만 return
        return { message: 'login2 success' };
    }

    // 로그인 한 때만 실행되는 메서드
    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard() {
        return '로그인된 때만 이 글이 보입니다.'
    }


    @UseGuards(LocalAuthGuard)
    @Post('login3')
    login3(@Req() req) {
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('test-guard2')
    testGuardWithSession(@Req() req) {
        return req.user;
    }
}
