import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    // findAll() {
    //     return `This action returns all users`;
    // }

    async findOne(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
        });
    }

    async remove(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }
}
