import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginDto, RegisterDto} from './dto/auth.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User as UserEntity} from "../typeorm/User";
import {Repository} from "typeorm";
import * as bcrypt from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";

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
        console.log(isPasswordCorrect);
        if(!isPasswordCorrect){
            throw new UnauthorizedException('Incorrect password');
        }
        const {password, ...userWithoutPassword} = user;
        const payload = { sub: user.id, username: user.username };
        return {
            message : "successfully connected",
            token : await this.jwtService.signAsync(payload),
        }
    }
}
