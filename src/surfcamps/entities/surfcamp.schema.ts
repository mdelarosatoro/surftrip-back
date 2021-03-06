import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PhotoI } from 'src/interfaces/photos.interface';
import { User } from 'src/users/entities/user.entity';

export type SurfcampDocument = Surfcamp & Document;

@Schema()
export class Surfcamp {
    @Prop({
        default: '',
    })
    stripeId: string;

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
        unique: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        required: true,
    })
    location: number[];

    @Prop({
        // enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true,
    })
    skillLevels: string[];

    @Prop({
        type: [
            {
                photoUrl: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
        default: [],
    })
    photos: PhotoI[];

    @Prop({
        required: true,
        default: 'surfcamp',
    })
    role: string;

    @Prop({ ref: 'Package' })
    packages: mongoose.Types.ObjectId[];

    @Prop({
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
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
    customers: [
        {
            user: User;
            package: string;
            bookedAt: number;
        }
    ];

    @Prop({
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                comment: String,
                rating: Number,
            },
        ],
        required: true,
        default: [],
    })
    comments: [
        {
            user: User;
            comment: string;
            rating: number;
        }
    ];

    @Prop({ default: 0 })
    rating: number;
}

export const SurfcampSchema = SchemaFactory.createForClass(Surfcamp);

SurfcampSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});
