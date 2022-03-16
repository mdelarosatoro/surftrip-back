import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { SurfcampOwnsPackageMiddleware } from './surfcamp-owns-package';
import { Model } from 'mongoose';
import { Package } from 'src/packages/entities/package.entity';

jest.mock('jsonwebtoken');

describe('Given the surfcamp ownership middleware', () => {
    jwt.verify.mockReturnValue({ id: 1 });
    describe('When instanced and calling use method with a matching id', () => {
        test('it should call next', async () => {
            const packageModel = {
                findById: jest.fn().mockResolvedValue({ surfcamp: 1 }),
            } as any as Model<Package>;
            const middleware = new SurfcampOwnsPackageMiddleware(packageModel);
            const next = jest.fn();
            const req = {
                params: { id: 1 },
                headers: { authorization: 'testToken' },
            } as any as Request;
            const res = {} as any as Response;
            await middleware.use(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When instanced and calling use method without a matching id', () => {
        test('it should throw', async () => {
            try {
                jwt.verify.mockReturnValue({ id: 2 });

                const packageModel = {
                    findById: jest.fn().mockResolvedValue({ surfcamp: 1 }),
                } as any as Model<Package>;
                const middleware = new SurfcampOwnsPackageMiddleware(
                    packageModel
                );
                const next = jest.fn();
                const req = {
                    params: { id: 2 },
                    headers: { authorization: 'testToken' },
                } as any as Request;
                const res = {} as any as Response;
                await middleware.use(req, res, next);
            } catch (error) {
                expect(error.message).toBe('User is not owner');
            }
        });
    });
});
