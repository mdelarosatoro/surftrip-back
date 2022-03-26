import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { SurfcampsController } from './surfcamps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SurfcampSchema } from './entities/surfcamp.schema';
import { SurfcampOwnershipMiddleware } from '../middleware/surfcamp-ownership';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Surfcamp', schema: SurfcampSchema },
        ]),
    ],
    controllers: [SurfcampsController],
    providers: [SurfcampsService],
})
export class SurfcampsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SurfcampOwnershipMiddleware)
            .exclude(
                { path: 'surfcamps', method: RequestMethod.GET },
                { path: 'surfcamps/search', method: RequestMethod.GET },
                { path: 'surfcamps', method: RequestMethod.POST },
                { path: 'surfcamps/:id', method: RequestMethod.GET },
                { path: 'surfcamps/:id/comments', method: RequestMethod.POST },
                { path: 'surfcamps/:id/comments', method: RequestMethod.GET },
                { path: 'surfcamps/:id/packages', method: RequestMethod.GET }
            )
            .forRoutes(SurfcampsController);
    }
}
