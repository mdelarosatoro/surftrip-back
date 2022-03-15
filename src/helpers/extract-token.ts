import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const extractToken = (token) => {
    const tokenExtracted = token.split(' ')[1];
    const tokenContents = jwt.verify(tokenExtracted, process.env.SECRET);
    if (!tokenContents) {
        throw new UnauthorizedException();
    }
    return tokenContents;
};
