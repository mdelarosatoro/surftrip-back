import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PackageDocument = Package & Document;

@Schema()
export class Package {
    @Prop({
        default: '',
    })
    stripeProductId: string;

    @Prop({
        default: '',
    })
    stripePriceId: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    price: number;

    @Prop({
        required: true,
    })
    days: number;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        required: true,
    })
    icon: string;

    @Prop({
        ref: 'Surfcamp',
    })
    surfcamp: mongoose.Types.ObjectId;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

PackageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
