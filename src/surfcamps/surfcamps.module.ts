import { Module } from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { SurfcampsController } from './surfcamps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SurfcampSchema } from './entities/surfcamp.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Surfcamp', schema: SurfcampSchema },
        ]),
    ],
    controllers: [SurfcampsController],
    providers: [SurfcampsService],
})
export class SurfcampsModule {}
