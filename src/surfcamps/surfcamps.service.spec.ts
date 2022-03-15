import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Surfcamp, SurfcampSchema } from './entities/surfcamp.schema';
import { SurfcampsService } from './surfcamps.service';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('SurfcampsService', () => {
    let service: SurfcampsService;

    jwt.verify.mockReturnValue({ role: 'user', id: 'testid' });

    const testSurfcamp = {
        _id: '623077c5f581ffc700c6fa1e',
        customers: [],
        packages: [
            {
                _id: '623081fc746cfc728c43d774',
                icon: 'url',
                description: 'blalbabla',
                days: 25,
                price: 700,
                name: '10 days all included',
            },
        ],
        role: 'surfcamp',
        photos: ['http://testphoto.coms'],
        skillLevels: ['Beginner'],
        location: 'test',
        name: 'test1',
        username: 'test1',
        email: 'test1@test.com',
        comments: [],
        rating: 0,
    };
    const testSurfcampWithPhoto = {
        _id: '623077c5f581ffc700c6fa1e',
        customers: [],
        packages: [
            {
                _id: '623081fc746cfc728c43d774',
                icon: 'url',
                description: 'blalbabla',
                days: 25,
                price: 700,
                name: '10 days all included',
            },
        ],
        role: 'surfcamp',
        photos: ['http://testphoto.coms', 'testPhoto2'],
        skillLevels: ['Beginner'],
        location: 'test',
        name: 'test1',
        username: 'test1',
        email: 'test1@test.com',
        comments: [],
        rating: 0,
    };

    beforeEach(async () => {
        const mockUserRepository = {
            find: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue([testSurfcamp]),
            }),
            findById: jest.fn().mockReturnValue({
                ...testSurfcamp,
                populate: jest.fn().mockReturnValue(testSurfcamp),
                save: jest.fn().mockReturnValue(testSurfcampWithPhoto),
            }),
            findByIdAndUpdate: jest.fn().mockResolvedValue(testSurfcamp),
            findByIdAndDelete: jest.fn().mockResolvedValue(testSurfcamp),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [SurfcampsService],
            imports: [
                MongooseModule.forFeature([
                    { name: Surfcamp.name, schema: SurfcampSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('Surfcamp'))
            .useValue(mockUserRepository)
            .compile();

        service = module.get<SurfcampsService>(SurfcampsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    test('When calling findAll it returns the testSurfcamp in an array', async () => {
        const result = await service.findAll();
        expect(result).toEqual([testSurfcamp]);
    });
    test('When calling search it returns the testSurfcamp in an array', async () => {
        const query = {
            location: 'test',
            rating: 0,
        };
        const result = await service.search(query);
        expect(result).toEqual([testSurfcamp]);
    });
    test('When calling findOne it returns the testSurfcamp', async () => {
        const result = await service.findOne('testid');
        expect(result).toEqual(testSurfcamp);
    });
    test('When calling update it returns the testSurfcamp', async () => {
        const result = await service.update('testid', { name: 'testName' });
        expect(result).toEqual(testSurfcamp);
    });
    test('When calling remove it returns the testSurfcamp', async () => {
        const result = await service.remove('testid');
        expect(result).toEqual(testSurfcamp);
    });
    test('When calling findSurfcampPackages it returns the testSurfcamp packages', async () => {
        const result = await service.findSurfcampPackages('testid');
        expect(result).toEqual(testSurfcamp.packages);
    });
    test('When calling addPhoto it returns the surfcamp with an added photo', async () => {
        const result = await service.addPhoto('testid', {
            photoUrl: 'testPhoto2',
        });
        const expectedResult = {
            ...testSurfcampWithPhoto,
            populate: jest.fn(),
            save: jest.fn(),
        };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
    test('When calling addPhoto it returns the surfcamp with an added photo', async () => {
        try {
            await service.addPhoto('testid', {
                photoUrl: 'http://testphoto.coms',
            });
        } catch (error) {
            expect(error.message).toBe(
                'This photo url already exists for this surfcamp'
            );
        }
    });
    test('When calling deletePhoto it returns the surfcamp with an added photo', async () => {
        const result = await service.deletePhoto('testid', {
            deletePhotoUrl: 'testPhoto2',
        });
        const expectedResult = {
            ...testSurfcampWithPhoto,
            photos: ['http://testphoto.coms'],
            populate: jest.fn(),
            save: jest.fn(),
        };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
    test('When calling addComment it returns the surfcamp with an added photo', async () => {
        const result = await service.addComment(
            'testId',
            { comment: 'testComment', rating: 'testRating' },
            'testToken'
        );
        expect(result.comments[0].comment).toBe('testComment');
        expect(result.comments[0].user).toBe('testid');
    });
    test('When calling addComment without user role it throws', async () => {
        try {
            jwt.verify.mockReturnValue({ role: 'surfcamp', id: 'testid' });
            await service.addComment(
                'testId',
                { comment: 'testComment', rating: 'testRating' },
                'testToken'
            );
        } catch (error) {
            expect(error.message).toBe('Only users can post comments');
        }
    });
});
