import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from '../interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { SurfcampDto, SurfcampLoginDto } from './dto/surfcamp.dto';
import { Surfcamp } from '../surfcamps/entities/surfcamp.schema';
import { User } from '../users/entities/user.entity';
import { extractToken } from '../helpers/extract-token';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}

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

    async loginToken(token: string): Promise<any> {
        const tokenContents = extractToken(token);
        if (!tokenContents) {
            throw new UnauthorizedException();
        }

        return tokenContents;
    }

    async registerSurfcamp(surfcampDto: SurfcampDto): Promise<Surfcamp> {
        const encryptedPasswordSurfcamp = {
            ...surfcampDto,
            password: bcrypt.hashSync(surfcampDto.password),
        };
        return await this.surfcampModel.create(encryptedPasswordSurfcamp);
    }

    async loginSurfcamp(surfcampLoginDto: SurfcampLoginDto): Promise<any> {
        const possibleUserDb = await this.surfcampModel.findOne({
            username: surfcampLoginDto.username,
        });
        if (possibleUserDb) {
            const passwordCheck = bcrypt.compareSync(
                surfcampLoginDto.password,
                possibleUserDb.password
            );

            if (passwordCheck) {
                const payload = {
                    id: possibleUserDb.id,
                    name: possibleUserDb.name,
                    username: possibleUserDb.username,
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
}
