import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserI>
    ) {}

    async register(newUser: UserDto): Promise<UserI> {
        return await this.userModel.create(newUser);
    }

    async findUser(possibleUser: UserLoginDto): Promise<any> {
        return await this.userModel.findOne({
            username: possibleUser.username,
        });
    }
}
