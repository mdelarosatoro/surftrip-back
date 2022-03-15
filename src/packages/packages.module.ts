import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './entities/package.entity';
import { SurfcampSchema } from 'src/surfcamps/entities/surfcamp.schema';
import { SurfcampOwnsPackageMiddleware } from 'src/middleware/surfcamp-owns-package';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Package', schema: PackageSchema },
            { name: 'Surfcamp', schema: SurfcampSchema },
        ]),
    ],
    controllers: [PackagesController],
    providers: [PackagesService],
})
export class PackagesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SurfcampOwnsPackageMiddleware)
            .exclude(
                { path: 'packages/:id', method: RequestMethod.GET },
                { path: 'packages', method: RequestMethod.GET },
                { path: 'packages', method: RequestMethod.POST }
            )
            .forRoutes(PackagesController);
    }
}
