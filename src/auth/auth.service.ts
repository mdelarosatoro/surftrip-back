import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TokenPayloadI } from 'src/interfaces/auth.interface';
import { User } from 'src/models/user.schema';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async registerUser(userDto: UserDto): Promise<UserI> {
        const encryptedPasswordUser = {
            ...userDto,
            password: bcrypt.hashSync(userDto.password),
        };
        return await this.userModel.create(encryptedPasswordUser);
    }

    async loginUser(userLoginDto: UserLoginDto): Promise<any> {
        const possibleUserDb = await this.userModel.findOne({
            username: userLoginDto.username,
        });
        if (possibleUserDb) {
            const passwordCheck = bcrypt.compareSync(
                userLoginDto.password,
                possibleUserDb.password
            );

            if (passwordCheck) {
                const payload = {
                    id: possibleUserDb.id,
                    name: possibleUserDb.name,
                    lastName: possibleUserDb.lastName,
                    role: possibleUserDb.role,
                };
                const token = jwt.sign(payload, process.env.SECRET);
                return { token };
            } else {
                throw new UnauthorizedException(
                    'Username or password incorrect'
                );
            }
        } else {
            throw new UnauthorizedException('Username or password incorrect');
        }
    }

    async loginTokenUser(token: string): Promise<TokenPayloadI> {
        const tokenExtracted = token.split(' ')[1];
        const tokenContents = jwt.verify(tokenExtracted, process.env.SECRET);
        if (!tokenContents) {
            throw new UnauthorizedException();
        }

        return tokenContents;
    }
}
