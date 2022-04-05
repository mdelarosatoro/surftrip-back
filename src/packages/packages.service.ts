import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Model } from 'mongoose';
import { Package } from './entities/package.entity';
import { Surfcamp } from '../surfcamps/entities/surfcamp.schema';
import { extractToken } from '../helpers/extract-token';
import Stripe from 'stripe';
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

        const stripe = new Stripe(
            'sk_test_51JUdtCGiuvhSIYzqnFSgtjsLVj5i7BZMZzc0C7j3dN0cppGKPleSLztGiiWEmM69EbOiLRdDp2XUndn3MuqhqTnp00XyALgDRz',
            { apiVersion: '2020-08-27' }
        );
        const stripeProduct = await stripe.products.create({
            name: createPackageDto.name,
            description: createPackageDto.description,
            images: [createPackageDto.icon],
        });
        const stripePrice = await stripe.prices.create({
            unit_amount: createPackageDto.price * 100,
            currency: 'eur',
            product: stripeProduct.id,
        });

        const newPackage = {
            ...createPackageDto,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
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
        return packagesDb.filter((item) => {
            const surfcamp = item.surfcamp as unknown as Surfcamp;
            return (
                (query.location !== ''
                    ? surfcamp.location.includes(query.location)
                    : true) &&
                (query.rating !== ''
                    ? surfcamp.rating >= Number(query.rating)
                    : true) &&
                (query.price !== ''
                    ? item.price <= Number(query.price)
                    : true) &&
                (query.days !== '' ? item.days <= Number(query.days) : true) &&
                (query.skillLevels.length > 0
                    ? surfcamp.skillLevels.some((element) =>
                          query.skillLevels.includes(element)
                      )
                    : true)
            );
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

        userDb.bookings.push({
            package: packageDb._id as unknown as Package,
            bookedAt: Date.now(),
        });
        await userDb.save();
        const newBookObject = {
            user: tokenContents.id,
            package: id,
            bookedAt: Date.now(),
        };
        surfcampDb.customers.push(newBookObject);
        await surfcampDb.save();

        const stripe = new Stripe(
            'sk_test_51JUdtCGiuvhSIYzqnFSgtjsLVj5i7BZMZzc0C7j3dN0cppGKPleSLztGiiWEmM69EbOiLRdDp2XUndn3MuqhqTnp00XyALgDRz',
            { apiVersion: '2020-08-27' }
        );

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: packageDb.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:4200/surfcamp-packages/${packageDb.surfcamp}`,
            cancel_url: 'https://example.com/failure',
            payment_intent_data: {
                application_fee_amount:
                    Math.floor(packageDb.price * 0.15) * 100,
                transfer_data: {
                    destination: surfcampDb.stripeId,
                },
            },
        });

        return session;
    }
}
