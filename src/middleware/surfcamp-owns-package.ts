import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Package } from 'src/packages/entities/package.entity';

@Injectable()
export class SurfcampOwnsPackageMiddleware implements NestMiddleware {
    constructor(
        @InjectModel('Package') private readonly packageModel: Model<Package>
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const tokenContents = jwt.verify(token, process.env.SECRET);
        const packageDb = await this.packageModel.findById(id);
        console.log(packageDb);
        if (packageDb.surfcamp === tokenContents.id) {
            next();
        } else {
            throw new UnauthorizedException('User is not owner');
        }
    }
}
