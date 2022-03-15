import { extractToken } from './extract-token';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Given the extractToken helper', () => {
    describe('When called with a token', () => {
        const mockReturn = { id: 'testid' };
        test('It should return the token contents', () => {
            jwt.verify.mockReturnValue(mockReturn);
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzA3N2M1ZjU4MWZmYzcwMGM2ZmExZSIsIm5hbWUiOiJ0ZXN0MSIsInVzZXJuYW1lIjoidGVzdDEiLCJyb2xlIjoic3VyZmNhbXAiLCJpYXQiOjE2NDczNTMzNzR9.bKHt11UibFvCyihHmLpb7VYIw46fdNeARKcRxgc5CXQ';
            expect(extractToken(token)).toEqual(mockReturn);
        });
    });
    describe('When jwt.verify returns false', () => {
        test('It should throw', () => {
            jwt.verify.mockReturnValue(false);
            try {
                const token = 'token';
                extractToken(token);
            } catch (error) {
                expect(error.message).toBe('Unauthorized');
            }
        });
    });
});
