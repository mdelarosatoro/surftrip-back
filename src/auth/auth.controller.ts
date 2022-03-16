import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserI } from '../interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import {
    UserTokenPayloadI,
    SurfcampTokenPayloadI,
} from '../interfaces/auth.interface';
import { SurfcampDto } from './dto/surfcamp.dto';
import { Surfcamp } from '../surfcamps/entities/surfcamp.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('users/register')
    async registerUser(@Body() userDto: UserDto): Promise<UserI> {
        return this.authService.registerUser(userDto);
    }

    @Post('users/login')
    async loginUser(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return this.authService.loginUser(userLoginDto);
    }

    @Get('login-token')
    async loginToken(
        @Headers('Authorization') token: string
    ): Promise<UserTokenPayloadI | SurfcampTokenPayloadI> {
        return this.authService.loginToken(token);
    }

    @Post('surfcamps/register')
    async registerSurfcamp(
        @Body() surfcampDto: SurfcampDto
    ): Promise<Surfcamp> {
        return this.authService.registerSurfcamp(surfcampDto);
    }

    @Post('surfcamps/login')
    async loginSurfcamp(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return this.authService.loginSurfcamp(userLoginDto);
    }
}
