import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Surfcamp } from 'src/surfcamps/entities/surfcamp.schema';

@Injectable()
export class SurfcampOwnershipMiddleware implements NestMiddleware {
    constructor(
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}
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
