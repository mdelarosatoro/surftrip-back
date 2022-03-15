import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSurfcampDto } from './dto/create-surfcamp.dto';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';
import { Model } from 'mongoose';
import { Surfcamp } from './entities/surfcamp.schema';

@Injectable()
export class SurfcampsService {
    constructor(
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}

    create(createSurfcampDto: CreateSurfcampDto) {
        return 'This action adds a new surfcamp';
    }

    findAll() {
        return this.surfcampModel.find({});
    }

    findOne(id: number) {
        return `This action returns a #${id} surfcamp`;
    }

    update(id: number, updateSurfcampDto: UpdateSurfcampDto) {
        return `This action updates a #${id} surfcamp`;
    }

    remove(id: number) {
        return `This action removes a #${id} surfcamp`;
    }
}
