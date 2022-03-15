import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Model } from 'mongoose';
import { Package } from './entities/package.entity';
import { Surfcamp } from 'src/surfcamps/entities/surfcamp.schema';

@Injectable()
export class PackagesService {
    constructor(
        @InjectModel('Package') private readonly packageModel: Model<Package>,
        @InjectModel('Surfcamp') private readonly surfcampModel: Model<Surfcamp>
    ) {}

    create(createPackageDto: CreatePackageDto) {
        return 'This action adds a new package';
    }

    findAll() {
        return `This action returns all packages`;
    }

    findOne(id: number) {
        return `This action returns a #${id} package`;
    }

    update(id: number, updatePackageDto: UpdatePackageDto) {
        return `This action updates a #${id} package`;
    }

    remove(id: number) {
        return `This action removes a #${id} package`;
    }
}
