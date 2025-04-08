import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {LoginDto, RegisterDto} from "./dto/auth.dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('auth')

@ApiTags('Utilisateurs')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('register')
    @ApiOperation({ summary: 'Se register' })
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }
    @ApiOperation({ summary: 'Se login' })
    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }
    @ApiOperation({ summary: 'Avoir les infos utilisateur' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return req.user;
    }
}
