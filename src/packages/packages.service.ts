import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Model } from 'mongoose';
import { Package } from './entities/package.entity';
import { Surfcamp } from '../surfcamps/entities/surfcamp.schema';
import { extractToken } from '../helpers/extract-token';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PackagesService {
    constructor(
        @InjectModel('Package') private readonly packageModel: Model<Package>,
        @InjectModel('Surfcamp')
        private readonly surfcampModel: Model<Surfcamp>,
        @InjectModel('User') private readonly userModel: Model<User>
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

    async search(query) {
        const packagesDb = await this.packageModel
            .find({})
            .populate('surfcamp', {
                packages: 0,
                username: 0,
                customers: 0,
                role: 0,
            });
        return packagesDb.filter(
            (item) =>
                item.price <= Number(query.price) &&
                item.days <= Number(query.days)
        );
    }

    findOne(id: string) {
        return this.packageModel.findById(id).populate('surfcamp', {
            packages: 0,
            username: 0,
            customers: 0,
            role: 0,
        });
    }

    update(id: string, updatePackageDto: UpdatePackageDto) {
        return this.packageModel.findByIdAndUpdate(id, updatePackageDto, {
            new: true,
        });
    }

    remove(id: string) {
        return this.packageModel.findByIdAndDelete(id);
    }

    async book(id: string, token: string) {
        const tokenContents = extractToken(token);
        const userDb = await this.userModel.findById(tokenContents.id);
        const packageDb = await this.packageModel.findById(id);
        const surfcampDb = await this.surfcampModel.findById(
            packageDb.surfcamp
        );

        userDb.bookings.push({ package: packageDb._id, bookedAt: Date.now() });
        await userDb.save();
        const newBookObject = {
            user: tokenContents.id,
            package: id,
        };
        surfcampDb.customers.push(newBookObject);
        await surfcampDb.save();
        return {
            message: `User ${userDb._id} successfully booked package ${packageDb._id}`,
        };
    }
}
