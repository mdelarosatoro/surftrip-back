import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserSchema } from '../models/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        registerUser: jest.fn(),
                        loginUser: jest.fn(),
                        loginTokenUser: jest.fn(),
                        registerSurfcamp: jest.fn(),
                        loginSurfcamp: jest.fn(),
                        loginTokenSurfcamp: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When controller.loginUser is called', () => {
        it('It should call service.loginUser', () => {
            controller.loginUser({ username: 'test', password: 'test' });
            expect(service.loginUser).toHaveBeenCalled();
        });
    });

    describe('When controller.registerUser is called', () => {
        it('It should call service.registerUser', () => {
            controller.registerUser({
                username: 'test',
                email: 'test@test.com',
                password: 'test',
                name: 'test',
                lastName: 'test',
            });
            expect(service.registerUser).toHaveBeenCalled();
        });
    });

    describe('When controller.loginTokenUser is called', () => {
        it('It should call service.loginTokenUser', () => {
            const token = 'baba';
            controller.loginTokenUser(token);
            expect(service.loginTokenUser).toHaveBeenCalled();
        });
    });

    describe('When controller.loginSurfcamp is called', () => {
        it('It should call service.loginSurfcamp', () => {
            controller.loginSurfcamp({ username: 'test', password: 'test' });
            expect(service.loginSurfcamp).toHaveBeenCalled();
        });
    });

    describe('When controller.registerSurfcamp is called', () => {
        it('It should call service.registerSurfcamp', () => {
            controller.registerSurfcamp({
                email: 'test@example.com',
                username: 'test',
                password: 'test',
                name: 'test',
                lastName: 'test',
                location: 'test',
                skillLevels: ['Beginner'],
            });
            expect(service.registerSurfcamp).toHaveBeenCalled();
        });
    });

    describe('When controller.loginTokenSurfcamp is called', () => {
        it('It should call service.loginTokenSurfcamp', () => {
            const token = 'baba';
            controller.loginTokenSurfcamp(token);
            expect(service.loginTokenSurfcamp).toHaveBeenCalled();
        });
    });
});
