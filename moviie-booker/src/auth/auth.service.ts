import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginDto, RegisterDto} from './dto/auth.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User as UserEntity} from "../typeorm/User";
import {Repository} from "typeorm";
import * as bcrypt from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";
// https://www.youtube.com/watch?v=s_HHyAWMeok
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}


    async register(registerDto : RegisterDto){
        let newUser = this.userRepository.create(registerDto);
        let saltedPassword  = await bcrypt.hash(newUser.password, 10)
        newUser = { ...newUser, password: saltedPassword  };
        let savedUser = await this.userRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }

    async login(loginDto : LoginDto){
        const user = await this.userRepository.findOneBy({username: loginDto.username})
        if(!user){
            throw new BadRequestException(`User with email '${loginDto.username}' not found`);
        }
        let isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordCorrect){
            throw new UnauthorizedException('Incorrect password');
        }
        const {password, ...userWithoutPassword} = user;
        const payload = { sub: user.id, username: user.username, email: user.email };
        return {
            message : "successfully connected",
            token : await this.jwtService.signAsync(payload),
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOneBy({username});
        if(!user){
            return null;
        }
        const isPasswordCorrect = await bcrypt.compare(pass, user.password)
        if (user && isPasswordCorrect) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
