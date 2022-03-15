import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    const testUser = {
        email: 'test@example.com',
        username: 'test',
        password: 'test',
        name: 'test',
        lastName: 'test',
        role: 'user',
    };

    const mockUserRepository = {
        findById: jest.fn().mockResolvedValue(testUser),
        findByIdAndUpdate: jest.fn().mockResolvedValue(testUser),
        findByIdAndDelete: jest.fn().mockResolvedValue(testUser),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
            imports: [
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(mockUserRepository)
            .compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const id = 'f1i0jx901j23dosi2m';

    test('When calling findOne it returns the test user', async () => {
        const result = await service.findOne(id);
        expect(result).toBe(testUser);
    });
    test('When calling update it returns the test user', async () => {
        const result = await service.update(id, { name: 'testUser' });
        expect(result).toBe(testUser);
    });
    test('When calling remove it returns the test user', async () => {
        const result = await service.remove(id);
        expect(result).toBe(testUser);
    });
});
