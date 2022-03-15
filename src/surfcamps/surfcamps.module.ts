import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { SurfcampsController } from './surfcamps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SurfcampSchema } from './entities/surfcamp.schema';
import { SurfcampOwnershipMiddleware } from 'src/middleware/surfcamp-ownership';

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
                { path: 'surfcamps/:id', method: RequestMethod.GET },
                { path: 'surfcamps', method: RequestMethod.GET },
                { path: 'surfcamps', method: RequestMethod.POST }
            )
            .forRoutes(SurfcampsController);
    }
}
