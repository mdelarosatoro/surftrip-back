import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
    Surfcamp,
    SurfcampSchema,
} from '../surfcamps/entities/surfcamp.schema';
import { Package, PackageSchema } from './entities/package.entity';
import { PackagesService } from './packages.service';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('PackagesService', () => {
    let service: PackagesService;

    const testPackage = {
        _id: '623081fc746cfc728c43d774',
        name: '10 days all included',
        description: 'blalbabla',
        icon: 'url',
        days: 25,
        price: 700,
        surfcamp: {
            _id: '623077c5f581ffc700c6fa1e',
            rating: [],
            photos: ['http://testphoto.coms'],
            skillLevels: ['Beginner'],
            location: 'test',
            name: 'test1',
            email: 'test1@test.com',
        },
    };

    const testSurfcamp = {
        _id: '623077c5f581ffc700c6fa1e',
        name: 'test1',
        rating: [],
        photos: ['http://testphoto.coms'],
        skillLevels: ['Beginner'],
        location: 'test',
        email: 'test1@test.com',
        packages: [],
    };

    jwt.verify.mockReturnValue({
        id: '623077c5f581ffc700c6fa1e',
        role: 'surfcamp',
    });

    beforeEach(async () => {
        const mockSurfcampRepository = {
            findById: jest.fn().mockResolvedValue({
                ...testSurfcamp,
                save: jest.fn().mockReturnValue(testPackage),
            }),
        };

        const mockPackageRepository = {
            findById: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue(testPackage),
            }),
            findByIdAndUpdate: jest.fn().mockResolvedValue(testPackage),
            findByIdAndDelete: jest.fn().mockResolvedValue(testPackage),
            create: jest.fn().mockResolvedValue(testPackage),
            find: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue([testPackage]),
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [PackagesService],
            imports: [
                MongooseModule.forFeature([
                    { name: Package.name, schema: PackageSchema },
                    { name: Surfcamp.name, schema: SurfcampSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('Package'))
            .useValue(mockPackageRepository)
            .overrideProvider(getModelToken('Surfcamp'))
            .useValue(mockSurfcampRepository)
            .compile();

        service = module.get<PackagesService>(PackagesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    test('When calling create it returns the testPackage', async () => {
        const createPackagteDtoTest = {
            name: 'test',
            price: 100,
            days: 10,
            description: 'test',
            icon: 'testUrl',
        };
        const surfcampToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzA3N2M1ZjU4MWZmYzcwMGM2ZmExZSIsIm5hbWUiOiJ0ZXN0MSIsInVzZXJuYW1lIjoidGVzdDEiLCJyb2xlIjoic3VyZmNhbXAiLCJpYXQiOjE2NDczNTMzNzR9.bKHt11UibFvCyihHmLpb7VYIw46fdNeARKcRxgc5CXQ';
        const result = await service.create(
            createPackagteDtoTest,
            surfcampToken
        );
        expect(result).toBe(testPackage);
    });
    test('When calling create with a user role, it throws', async () => {
        try {
            jwt.verify.mockReturnValue({ id: 'testId', role: 'user' });
            const createPackagteDtoTest = {
                name: 'test',
                price: 100,
                days: 10,
                description: 'test',
                icon: 'testUrl',
            };
            const surfcampToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzA3N2M1ZjU4MWZmYzcwMGM2ZmExZSIsIm5hbWUiOiJ0ZXN0MSIsInVzZXJuYW1lIjoidGVzdDEiLCJyb2xlIjoic3VyZmNhbXAiLCJpYXQiOjE2NDczNTMzNzR9.bKHt11UibFvCyihHmLpb7VYIw46fdNeARKcRxgc5CXQ';
            await service.create(createPackagteDtoTest, surfcampToken);
        } catch (error) {
            expect(error.message).toBe('User is not a surfcamp');
        }
    });
    test('When calling findAll it returns the testPackage', async () => {
        const result = await service.findAll();
        expect(result).toEqual([testPackage]);
    });
    test('When calling findOne it returns the testPackage', async () => {
        const result = await service.findOne('testid');
        expect(result).toEqual(testPackage);
    });
    test('When calling update it returns the testPackage', async () => {
        const result = await service.update('testid', { name: 'testName' });
        expect(result).toEqual(testPackage);
    });
    test('When calling remove it returns the testPackage', async () => {
        const result = await service.remove('testid');
        expect(result).toEqual(testPackage);
    });
});
