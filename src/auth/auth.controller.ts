import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import {
    UserTokenPayloadI,
    SurfcampTokenPayloadI,
} from 'src/interfaces/auth.interface';
import { SurfcampDto } from './dto/surfcamp.dto';
import { Surfcamp } from 'src/models/surfcamp.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('users/register')
    async registerUser(@Body() userDto: UserDto): Promise<UserI> {
        return await this.authService.registerUser(userDto);
    }

    @Post('users/login')
    async loginUser(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return await this.authService.loginUser(userLoginDto);
    }

    @Get('users/login-token')
    async loginTokenUser(
        @Headers('Authorization') token: string
    ): Promise<UserTokenPayloadI> {
        return await this.authService.loginTokenUser(token);
    }

    @Post('surfcamps/register')
    async registerSurfcamp(
        @Body() surfcampDto: SurfcampDto
    ): Promise<Surfcamp> {
        return await this.authService.registerSurfcamp(surfcampDto);
    }

    @Post('surfcamps/login')
    async loginSurfcamp(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return await this.authService.loginSurfcamp(userLoginDto);
    }

    @Get('surfcamps/login-token')
    async loginTokenSurfcamp(
        @Headers('Authorization') token: string
    ): Promise<SurfcampTokenPayloadI> {
        return await this.authService.loginTokenSurfcamp(token);
    }
}
