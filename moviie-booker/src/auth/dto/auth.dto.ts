import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
//https://medium.com/@yelinliu/dto-explained-in-nestjs-3a296498d77b
export class RegisterDto {
    @ApiProperty({ example: 'test', description: 'Identifiant unique de l\'utilisateur' })
    @IsNotEmpty()
    @MinLength(2)
    username: string;
    @ApiProperty({ example: 'test@test.com', description: 'Adresse email de l\'utilisateur' })
    @IsEmail()
    @MinLength(10)
    email: string;
    @ApiProperty({ description: 'Mot de passe de l\'utilisateur' })
    @IsNotEmpty()
    password: string
}

export class LoginDto {
    @ApiProperty({ example: 'test', description: 'Identifiant l\'utilisateur' })
    @IsNotEmpty()
    username : string;
    @ApiProperty({ description: 'Mot de passe de l\'utilisateur' })
    @IsNotEmpty()
    password : string
}