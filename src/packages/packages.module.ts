import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './entities/package.entity';
import { SurfcampSchema } from 'src/surfcamps/entities/surfcamp.schema';

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
export class PackagesModule {}
