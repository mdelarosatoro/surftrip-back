import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';
import { Model } from 'mongoose';
import { Surfcamp } from './entities/surfcamp.schema';

@Injectable()
export class SurfcampsService {
    constructor(
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}

    findAll() {
        return this.surfcampModel
            .find({})
            .populate('packages', { surfcampId: 0 });
    }

    findOne(id: string) {
        return this.surfcampModel
            .findById(id)
            .populate('packages', { surfcampId: 0 });
    }

    update(id: string, updateSurfcampDto: UpdateSurfcampDto) {
        return this.surfcampModel.findByIdAndUpdate(id, updateSurfcampDto, {
            new: true,
        });
    }

    remove(id: string) {
        return this.surfcampModel.findByIdAndDelete(id);
    }
}
