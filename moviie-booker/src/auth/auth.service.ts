import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
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
        let isUserAvailable = await this.userRepository.findOneBy({email : registerDto.email})
        if(isUserAvailable){
           throw new ConflictException(`Username '${registerDto.email}' already taken`)
        }
        let newUser = this.userRepository.create(registerDto);
        let saltedPassword  = await bcrypt.hash(newUser.password, 10)
        newUser = { ...newUser, password: saltedPassword  };
        let savedUser = await this.userRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }

    async login(loginDto : LoginDto){
        const user = await this.userRepository.findOneBy({email: loginDto.email})
        if(!user){
            throw new BadRequestException(`User with email '${loginDto.email}' not found`);
        }
        let isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordCorrect){
            throw new UnauthorizedException('Incorrect password');
        }
        const {password, ...userWithoutPassword} = user;
        const payload = { id: user.id, email: user.email };
        return {
            message : "successfully connected",
            token : await this.jwtService.signAsync(payload),
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOneBy({email});
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
