import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from '../interfaces/user.interface';
import { UserDto, UserLoginDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Stripe from 'stripe';

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
                    email: possibleUserDb.email,
                    profilePicUrl: possibleUserDb.profilePicUrl,
                    role: possibleUserDb.role,
                };
                const token = jwt.sign(payload, process.env.SECRET);
                return {
                    token,
                    id: possibleUserDb.id,
                    name: possibleUserDb.name,
                    lastName: possibleUserDb.lastName,
                    email: possibleUserDb.email,
                    profilePicUrl: possibleUserDb.profilePicUrl,
                    role: possibleUserDb.role,
                };
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
        if (!tokenContents.id) {
            throw new UnauthorizedException();
        }

        return tokenContents;
    }

    async registerSurfcamp(surfcampDto: SurfcampDto): Promise<any> {
        const encryptedPasswordSurfcamp = {
            ...surfcampDto,
            password: bcrypt.hashSync(surfcampDto.password),
        };
        const stripe = new Stripe(
            'sk_test_51JUdtCGiuvhSIYzqnFSgtjsLVj5i7BZMZzc0C7j3dN0cppGKPleSLztGiiWEmM69EbOiLRdDp2XUndn3MuqhqTnp00XyALgDRz',
            { apiVersion: '2020-08-27' }
        );

        const stripeAccount = await stripe.accounts.create({
            type: 'express',
            email: surfcampDto.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: 'http://localhost:4200/login',
            return_url: 'http://localhost:4200/login',
            type: 'account_onboarding',
        });

        const newSurfcampDb = await this.surfcampModel.create({
            ...encryptedPasswordSurfcamp,
            stripeId: stripeAccount.id,
        });

        if (newSurfcampDb) {
            return accountLink;
        } else {
            throw new BadRequestException();
        }
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
                return {
                    token,
                    id: payload.id,
                    name: payload.name,
                    username: payload.username,
                    role: payload.role,
                };
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
