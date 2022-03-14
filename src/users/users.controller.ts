import { Body, Controller, Post } from '@nestjs/common';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() userDto: UserDto): Promise<UserI> {
        return this.usersService.createUser(userDto);
    }
}
