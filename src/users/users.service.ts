import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async findAll() {
        return await this.userModel.find({});
    }

    async findOne(id: string): Promise<User> {
        return await this.userModel.findById(id).populate('bookings.package');
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            updateUserDto,
            {
                new: true,
            }
        );
        const payload = {
            id: updatedUser.id,
            name: updatedUser.name,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            profilePicUrl: updatedUser.profilePicUrl,
            role: updatedUser.role,
        };
        const token = jwt.sign(payload, process.env.SECRET);

        return { user: updatedUser, token };
    }

    async remove(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }
}
