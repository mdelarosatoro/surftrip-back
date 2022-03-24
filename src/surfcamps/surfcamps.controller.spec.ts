import { Test, TestingModule } from '@nestjs/testing';
import { SurfcampsController } from './surfcamps.controller';
import { SurfcampsService } from './surfcamps.service';

describe('SurfcampsController', () => {
    let controller: SurfcampsController;
    let service: SurfcampsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SurfcampsController],
            providers: [
                {
                    provide: SurfcampsService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        search: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findSurfcampPackages: jest.fn(),
                        addPhoto: jest.fn(),
                        deletePhoto: jest.fn(),
                        addComment: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SurfcampsController>(SurfcampsController);
        service = module.get<SurfcampsService>(SurfcampsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When controller.findAll is called', () => {
        it('It should call service.findAll', () => {
            controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
        });
    });
    describe('When controller.searchSurfcamps is called', () => {
        it('It should call service.search', () => {
            controller.searchSurfcamps(
                'true',
                'true',
                'true',
                'true',
                'true',
                'true'
            );
            expect(service.search).toHaveBeenCalled();
        });
    });
    describe('When controller.findOne is called', () => {
        it('It should call service.findOne', () => {
            controller.findOne('fakeid');
            expect(service.findOne).toHaveBeenCalled();
        });
    });
    describe('When controller.update is called', () => {
        it('It should call service.update', () => {
            controller.update('fakeid', { name: 'test' });
            expect(service.update).toHaveBeenCalled();
        });
    });
    describe('When controller.remove is called', () => {
        it('It should call service.remove', () => {
            controller.remove('fakeid');
            expect(service.remove).toHaveBeenCalled();
        });
    });
    describe('When controller.findSurfcampPackages is called', () => {
        it('It should call service.findSurfcampPackages', () => {
            controller.findSurfcampPackages('fakeid');
            expect(service.findSurfcampPackages).toHaveBeenCalled();
        });
    });
    describe('When controller.addPhoto is called', () => {
        it('It should call service.addPhoto', () => {
            controller.addPhoto('fakeid', {
                photoUrl: 'testurl',
                description: 'test',
            });
            expect(service.addPhoto).toHaveBeenCalled();
        });
    });
    describe('When controller.deletePhoto is called', () => {
        it('It should call service.deletePhoto', () => {
            controller.deletePhoto('fakeid', { deletePhotoUrl: 'testurl' });
            expect(service.deletePhoto).toHaveBeenCalled();
        });
    });
    describe('When controller.addComment is called', () => {
        it('It should call service.addComment', () => {
            controller.addComment('testToken', 'testId', {
                comment: 'testComment',
                rating: '2',
            });
            expect(service.addComment).toHaveBeenCalled();
        });
    });
});
