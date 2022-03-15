import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Model } from 'mongoose';
import { Package } from './entities/package.entity';
import { Surfcamp } from 'src/surfcamps/entities/surfcamp.schema';
import { extractToken } from 'src/helpers/extract-token';

@Injectable()
export class PackagesService {
    constructor(
        @InjectModel('Package') private readonly packageModel: Model<Package>,
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}

    async create(
        createPackageDto: CreatePackageDto,
        token: string
    ): Promise<Package> {
        const extractedToken = extractToken(token);
        if (extractedToken.role !== 'surfcamp') {
            throw new UnauthorizedException('User is not a surfcamp');
        }
        const newPackage = {
            ...createPackageDto,
            surfcamp: extractedToken.id,
        };
        console.log(extractedToken.id);
        const surfcampDb = await this.surfcampModel.findById(extractedToken.id);
        const newPackageDb = await this.packageModel.create(newPackage);
        surfcampDb.packages.push(newPackageDb._id);
        await surfcampDb.save();
        return newPackageDb;
    }

    findAll() {
        return this.packageModel.find({}).populate('surfcamp', {
            packages: 0,
            username: 0,
            customers: 0,
            role: 0,
        });
    }

    findOne(id: string) {
        return this.packageModel.findById(id).populate('surfcamp', {
            packages: 0,
            username: 0,
            customers: 0,
            role: 0,
        });
    }

    update(id: number, updatePackageDto: UpdatePackageDto) {
        return `This action updates a #${id} package`;
    }

    remove(id: number) {
        return `This action removes a #${id} package`;
    }
}
