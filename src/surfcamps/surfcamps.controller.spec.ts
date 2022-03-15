import { Test, TestingModule } from '@nestjs/testing';
import { SurfcampsController } from './surfcamps.controller';
import { SurfcampsService } from './surfcamps.service';

describe('SurfcampsController', () => {
    let controller: SurfcampsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SurfcampsController],
            providers: [SurfcampsService],
        }).compile();

        controller = module.get<SurfcampsController>(SurfcampsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
