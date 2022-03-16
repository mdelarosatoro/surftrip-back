import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserOwnershipMiddleware } from './user-ownership';

jest.mock('jsonwebtoken');

describe('Given the surfcamp ownership middleware', () => {
    jwt.verify.mockReturnValue({ id: 1 });
    describe('When instanced and calling use method with a matching id', () => {
        test('it should call next', async () => {
            const middleware = new UserOwnershipMiddleware();
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
                const middleware = new UserOwnershipMiddleware();
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
