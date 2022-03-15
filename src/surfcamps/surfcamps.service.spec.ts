import { Test, TestingModule } from '@nestjs/testing';
import { SurfcampsService } from './surfcamps.service';

describe('SurfcampsService', () => {
    let service: SurfcampsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SurfcampsService],
        }).compile();

        service = module.get<SurfcampsService>(SurfcampsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
