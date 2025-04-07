import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User as UserEntity} from "../typeorm/User";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}
    async register(registerDto : RegisterDto){
        let newUser = this.userRepository.create(registerDto);
        let saltedPassword  = await bcrypt.hash(newUser.password, 10)
        newUser = { ...newUser, password: saltedPassword  };
        let savedUser = await this.userRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
}
