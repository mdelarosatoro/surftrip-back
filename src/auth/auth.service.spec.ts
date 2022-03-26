import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {
    Surfcamp,
    SurfcampSchema,
} from '../surfcamps/entities/surfcamp.schema';
import { SurfcampDto } from './dto/surfcamp.dto';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UsersService', () => {
    describe('When calling the services with correct parameters', () => {
        let service: AuthService;

        const testUser = {
            email: 'test@example.com',
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            role: 'user',
            ProfilePicUrl: '',
        };
        const testUserLoginResponse = {
            id: '',
            profilePicUrl: '',
            email: 'test@example.com',
            name: 'test',
            lastName: 'test',
            role: 'user',
        };
        const testUserLogin = {
            username: 'test',
            password: 'test',
        };
        const testSurfcamp: SurfcampDto = {
            email: 'test@example.com',
            username: 'test',
            password: 'test',
            description: '',
            name: 'test',
            lastName: 'test',
            location: 'test',
            skillLevels: ['Beginner'],
        };
        const testSurfcampLoginResponse = {
            id: 'test',
            name: 'test',
            role: 'test',
            username: 'test',
        };

        const mockUserRepository = {
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(testUserLoginResponse),
        };
        const mockSurfcampRepository = {
            create: jest.fn().mockResolvedValue(testSurfcamp),
            findOne: jest.fn().mockResolvedValue(testSurfcampLoginResponse),
        };
        beforeEach(async () => {
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                        { name: Surfcamp.name, schema: SurfcampSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockUserRepository)
                .overrideProvider(getModelToken('Surfcamp'))
                .useValue(mockSurfcampRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        test('When calling registerUser it returns the test user', async () => {
            const result = await service.registerUser(testUser);
            expect(result).toBe(testUser);
        });

        test('When calling loginUser it returns a token', async () => {
            const result = await service.loginUser({ ...testUserLogin });
            expect(result).toEqual({
                ...testUserLoginResponse,
                token: 'token',
            });
        });

        test('When calling loginToken with a bad token it throws', async () => {
            try {
                jwt.verify.mockReturnValue({});
                await service.loginToken(
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmY1MzQ3NDc3NjFlZDZiODFiNDI3MiIsIm5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NDcyNzIzMzV9.YItW0NY-gM88ah7gVANJrpeZEJwjv8-W0NJCItHcKQI`
                );
            } catch (error) {
                expect(error.message).toEqual('Unauthorized');
            }
        });
        test('When calling loginTokenUser it returns a user', async () => {
            jwt.verify.mockReturnValue({ ...testUser, id: 1 });
            const result = await service.loginToken(
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmY1MzQ3NDc3NjFlZDZiODFiNDI3MiIsIm5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NDcyNzIzMzV9.YItW0NY-gM88ah7gVANJrpeZEJwjv8-W0NJCItHcKQI`
            );
            expect(result).toEqual({ ...testUser, id: 1 });
        });

        test('When calling loginTokenUser with a bad token it throws', async () => {
            jwt.verify.mockReturnValue(false);
            try {
                await service.loginToken(`Bearer aaaa`);
            } catch (error) {
                expect(error.message).toEqual('Unauthorized');
            }
        });

        test('When calling registerSurfcamp it returns the test surfcamp', async () => {
            const result = await service.registerSurfcamp(testSurfcamp);
            expect(result).toBe(testSurfcamp);
        });

        test('When calling loginSurfcamp it returns a token', async () => {
            const result = await service.loginSurfcamp(testUserLogin);
            expect(result).toEqual({
                ...testSurfcampLoginResponse,
                token: 'token',
            });
        });

        test('When calling loginTokenSurfcamp with a bad token it throws', async () => {
            jwt.verify.mockReturnValue(false);
            try {
                await service.loginToken(`Bearer aaaa`);
            } catch (error) {
                expect(error.message).toEqual('Unauthorized');
            }
        });
    });

    describe('When calling loginUser with a bad user', () => {
        let service: AuthService;

        const testUser = {
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            role: 'user',
        };
        const testUserLogin = {
            username: 'test',
            password: 'test',
        };
        const testSurfcamp = {
            email: 'test@example.com',
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            location: 'test',
            skillLevels: 'Beginner',
        };

        const mockUserRepository = {
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(false),
        };
        const mockSurfcampRepository = {
            create: jest.fn().mockResolvedValue(testSurfcamp),
            findOne: jest.fn().mockResolvedValue(testSurfcamp),
        };
        test('When calling loginUser with a bad user, it throws', async () => {
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                        { name: Surfcamp.name, schema: SurfcampSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockUserRepository)
                .overrideProvider(getModelToken('Surfcamp'))
                .useValue(mockSurfcampRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginUser(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
        test('When calling loginUser with a bad user, it throws', async () => {
            mockUserRepository.findOne = jest
                .fn()
                .mockResolvedValue({ username: 'test', password: 'test' });
            bcrypt.compareSync.mockReturnValue(false);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                        { name: Surfcamp.name, schema: SurfcampSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockUserRepository)
                .overrideProvider(getModelToken('Surfcamp'))
                .useValue(mockSurfcampRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginUser(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
    });
    describe('When calling loginSurfcamp with a bad user', () => {
        let service: AuthService;

        const testUser = {
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            role: 'user',
        };
        const testUserLogin = {
            username: 'test',
            password: 'test',
        };
        const testSurfcamp = {
            email: 'test@example.com',
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            location: 'test',
            skillLevels: 'Beginner',
        };

        const mockUserRepository = {
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(testUser),
        };
        const mockSurfcampRepository = {
            create: jest.fn().mockResolvedValue(testSurfcamp),
            findOne: jest.fn().mockResolvedValue(false),
        };
        test('When calling loginSurfcamp with a bad user, it throws', async () => {
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                        { name: Surfcamp.name, schema: SurfcampSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockUserRepository)
                .overrideProvider(getModelToken('Surfcamp'))
                .useValue(mockSurfcampRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginSurfcamp(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
        test('When calling loginUser with a bad user, it throws', async () => {
            mockSurfcampRepository.findOne = jest
                .fn()
                .mockResolvedValue({ username: 'test', password: 'test' });
            bcrypt.compareSync.mockReturnValue(false);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                        { name: Surfcamp.name, schema: SurfcampSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockUserRepository)
                .overrideProvider(getModelToken('Surfcamp'))
                .useValue(mockSurfcampRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginSurfcamp(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
    });
});
