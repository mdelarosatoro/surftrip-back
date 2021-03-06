import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

describe('PackagesController', () => {
    let controller: PackagesController;
    let service: PackagesService;

    const testCreatePackageDto = {
        name: 'test',
        price: 100,
        days: 10,
        description: 'test',
        icon: 'testUrl',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PackagesController],
            providers: [
                {
                    provide: PackagesService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        search: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        book: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PackagesController>(PackagesController);
        service = module.get<PackagesService>(PackagesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('When controller.create is called', () => {
        it('It should call service.create', () => {
            controller.create(testCreatePackageDto, 'testtoken');
            expect(service.create).toHaveBeenCalled();
        });
    });
    describe('When controller.findAll is called', () => {
        it('It should call service.findAll', () => {
            controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
        });
    });
    describe('When controller.searchSurfcamps is called', () => {
        it('It should call service.searchSurfcamps', () => {
            controller.searchPackages(
                'test',
                'test',
                'test',
                'test',
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
            controller.findOne('testid');
            expect(service.findOne).toHaveBeenCalled();
        });
    });
    describe('When controller.update is called', () => {
        it('It should call service.update', () => {
            controller.update('testid', { name: 'test' });
            expect(service.update).toHaveBeenCalled();
        });
    });
    describe('When controller.remove is called', () => {
        it('It should call service.remove', () => {
            controller.remove('testid');
            expect(service.remove).toHaveBeenCalled();
        });
    });
    describe('When controller.book is called', () => {
        it('It should call service.book', () => {
            controller.book('testid', 'testToken');
            expect(service.book).toHaveBeenCalled();
        });
    });
});
