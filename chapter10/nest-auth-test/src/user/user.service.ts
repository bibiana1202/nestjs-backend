import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,) { }

    // 유저 생성
    createUser(user): Promise<User> {
        return this.userRepository.save(user);
    }

    // 한 명의 유저 정보 찾기
    async getUser(email: string) {
        const result = await this.userRepository.findOne({
            where: { email },
        });
        return result;
    }

    // 유저 정보 업데이트. username과 password만 변경
    async updateUser(email, _user) {
        const user = await this.getUser(email);
        if (!user) {
            throw new Error('User not found');
        }
        console.log(_user);
        user.username = _user.username;
        user.password = _user.password;
        console.log(user);
        this.userRepository.save(user);
    }

    // 유저 정보 삭제
    deleteUser(email: any) {
        return this.userRepository.delete({ email });
    }
}
