import { ConflictException, Injectable } from '@nestjs/common';
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
            .populate('packages', { surfcamp: 0 });
    }

    findOne(id: string) {
        return this.surfcampModel
            .findById(id)
            .populate('packages', { surfcamp: 0 });
    }

    update(id: string, updateSurfcampDto: UpdateSurfcampDto) {
        return this.surfcampModel.findByIdAndUpdate(id, updateSurfcampDto, {
            new: true,
        });
    }

    remove(id: string) {
        return this.surfcampModel.findByIdAndDelete(id);
    }

    async findSurfcampPackages(id: string) {
        const surfcampDb = await this.surfcampModel
            .findById(id)
            .populate('packages');
        return surfcampDb.packages;
    }

    async addPhoto(id: string, newPhoto: { photoUrl: string }) {
        const surfcampDb = await this.surfcampModel.findById(id);
        if (surfcampDb.photos.includes(newPhoto.photoUrl)) {
            throw new ConflictException(
                'This photo url already exists for this surfcamp'
            );
        }
        surfcampDb.photos.push(newPhoto.photoUrl);
        await surfcampDb.save();
        return surfcampDb;
    }

    async deletePhoto(id: string, deletePhoto: { deletePhotoUrl: string }) {
        const surfcampDb = await this.surfcampModel.findById(id);
        surfcampDb.photos = surfcampDb.photos.filter(
            (item) => item !== deletePhoto.deletePhotoUrl
        );
        await surfcampDb.save();
        return surfcampDb;
    }
}
