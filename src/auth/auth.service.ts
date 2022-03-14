import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TokenPayloadI } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserI>
    ) {}

    async register(userDto: UserDto): Promise<UserI> {
        const encryptedPasswordUser = {
            ...userDto,
            password: bcrypt.hashSync(userDto.password),
        };
        return await this.userModel.create(encryptedPasswordUser);
    }

    async findUserByUserName(possibleUser: UserLoginDto): Promise<any> {
        return await this.userModel.findOne({
            username: possibleUser.username,
        });
    }

    async login(userLoginDto: UserLoginDto): Promise<any> {
        const possibleUserDb = await this.findUserByUserName(userLoginDto);

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

    async loginToken(token: string): Promise<TokenPayloadI> {
        const tokenExtracted = token.split(' ')[1];
        const tokenContents = jwt.verify(tokenExtracted, process.env.SECRET);
        if (!tokenContents) {
            throw new UnauthorizedException();
        }

        return tokenContents;
    }
}
