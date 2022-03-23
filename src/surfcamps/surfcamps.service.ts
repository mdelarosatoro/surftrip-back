import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';
import { Model } from 'mongoose';
import { Surfcamp } from './entities/surfcamp.schema';
import { extractToken } from '../helpers/extract-token';
import { PhotoI } from 'src/interfaces/photos.interface';

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
        console.log(Number(query.rating));
        const surfcampsDb = await this.surfcampModel
            .find({})
            .populate('packages', { surfcamp: 0 });
        return surfcampsDb.filter((item) => {
            return (
                (item.location !== ''
                    ? item.location.includes(query.location)
                    : true) &&
                (query.rating !== ''
                    ? item.rating >= Number(query.rating)
                    : true) &&
                (query.skillLevels.length > 0
                    ? item.skillLevels.some((element) =>
                          query.skillLevels.includes(element)
                      )
                    : true)
            );
        });
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

    async addPhoto(id: string, newPhoto: PhotoI) {
        const surfcampDb = await this.surfcampModel.findById(id);
        if (
            surfcampDb.photos.find(
                (item) => item.photoUrl === newPhoto.photoUrl
            )
        ) {
            throw new ConflictException(
                'This photo url already exists for this surfcamp'
            );
        }
        surfcampDb.photos.push(newPhoto);
        await surfcampDb.save();
        return surfcampDb;
    }

    async deletePhoto(id: string, deletePhoto: { deletePhotoUrl: string }) {
        const surfcampDb = await this.surfcampModel.findById(id);
        surfcampDb.photos = surfcampDb.photos.filter(
            (item) => item.photoUrl !== deletePhoto.deletePhotoUrl
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
        surfcampDb.rating = 0;
        surfcampDb.comments.forEach((comment) => {
            surfcampDb.rating += comment.rating;
        });
        surfcampDb.rating = surfcampDb.rating / surfcampDb.comments.length;
        await surfcampDb.save();
        return surfcampDb.comments;
    }

    async getSurfcampCommentsById(id: string) {
        const surfcampDb = await this.surfcampModel
            .findById(id)
            .populate('comments.user', {
                name: 1,
                lastName: 1,
                profilePicUrl: 1,
            });

        return surfcampDb.comments;
    }
}
