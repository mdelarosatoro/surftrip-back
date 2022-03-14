import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { TokenPayloadI } from 'src/interfaces/auth.interface';

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
    ): Promise<TokenPayloadI> {
        return await this.authService.loginTokenUser(token);
    }
}
