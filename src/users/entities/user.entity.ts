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
        default: '',
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
