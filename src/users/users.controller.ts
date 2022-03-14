import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Get()
    // findAll() {
    //     return this.usersService.findAll();
    // }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<User> {
        return await this.usersService.remove(id);
    }
}
