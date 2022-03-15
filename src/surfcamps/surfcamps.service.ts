import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';
import { Model } from 'mongoose';
import { Surfcamp } from './entities/surfcamp.schema';
import { extractToken } from 'src/helpers/extract-token';

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

    async search(query) {
        const surfcampsDb = await this.surfcampModel
            .find({})
            .populate('packages', { surfcamp: 0 });
        const filteredSurfcamps = surfcampsDb.filter(
            (item) =>
                item.location.includes(query.location) &&
                item.rating >= Number(query.rating)
        );
        return filteredSurfcamps;
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

    async addComment(
        id: string,
        newComment: { comment: string; rating: string },
        token: string
    ) {
        const decodedToken = extractToken(token);
        if (decodedToken.role !== 'user') {
            throw new ForbiddenException('Only users can post comments');
        }
        const surfcampDb = await this.surfcampModel.findById(id);
        const payload = {
            ...newComment,
            rating: Number(newComment.rating),
            user: decodedToken.id,
        };
        surfcampDb.comments.push(payload);
        await surfcampDb.save();
        return surfcampDb;
    }
}
