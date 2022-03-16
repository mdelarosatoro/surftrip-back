import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type SurfcampDocument = Surfcamp & Document;

@Schema()
export class Surfcamp {
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
    location: string;

    @Prop({
        // enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true,
    })
    skillLevels: string[];

    @Prop()
    photos: string[];

    @Prop({
        required: true,
        default: 'surfcamp',
    })
    role: string;

    @Prop({ ref: 'Package' })
    packages: mongoose.Types.ObjectId[];

    // @Prop({ ref: 'User' })
    // customers: mongoose.Types.ObjectId[];

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
            },
        ],
        required: true,
        default: [],
    })
    customers: [
        {
            user: User;
            package: string;
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
