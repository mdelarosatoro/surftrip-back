import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    const id = 'fi10210id1s2idm12';

    describe('When controller.findAll is called', () => {
        it('It should call service.findAll', async () => {
            await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('When controller.findOne is called', () => {
        it('It should call service.findOne', () => {
            controller.findOne(id);
            expect(service.findOne).toHaveBeenCalled();
        });
    });

    describe('When controller.update is called', () => {
        it('It should call service.update', () => {
            controller.update(id, { name: 'Charles' });
            expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When controller.remove is called', () => {
        it('It should call service.remove', () => {
            controller.remove(id);
            expect(service.remove).toHaveBeenCalled();
        });
    });
});
