import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserOwnershipMiddleware implements NestMiddleware {
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
