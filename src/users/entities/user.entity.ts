import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Package } from 'src/packages/entities/package.entity';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
        unique: true,
    })
    username: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    lastName: string;

    @Prop({
        required: true,
        default: 'user',
    })
    role: string;

    @Prop({
        default:
            'https://firebasestorage.googleapis.com/v0/b/surftrip-18659.appspot.com/o/default%20profile.jpeg?alt=media&token=4db234c6-42c7-4e73-b834-c2d626f77361',
    })
    profilePicUrl: string;

    @Prop({
        type: [
            {
                package: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Package',
                    required: true,
                },
                bookedAt: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
        required: true,
        default: [],
    })
    bookings: [
        {
            package: Package;
            bookedAt: number;
        }
    ];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});
