import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @MinLength(2)
    username: string;
    @IsEmail()
    @MinLength(10)
    email: string;
    @IsNotEmpty()
    password: string
}

export class LoginDto {
    @IsNotEmpty()
    username : string;
    @IsNotEmpty()
    password : string
}