import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserOwnershipMiddleware implements NestMiddleware {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
    use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const tokenContents = jwt.verify(token, process.env.SECRET);
        if (id === tokenContents.id) {
            next();
        } else {
            throw new UnauthorizedException('User is not owner');
        }
    }
}
