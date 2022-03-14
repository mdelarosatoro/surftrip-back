import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserI>
    ) {}

    async createUser(newUser: UserI): Promise<UserI> {
        return await this.userModel.create(newUser);
    }
}
