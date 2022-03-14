import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
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

    @Prop({
        required: true,
        default: 'surfcamp',
    })
    role: string;

    @Prop()
    packages: [];

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    customers: User[];

    @Prop()
    rating: number[];
}

export const SurfcampSchema = SchemaFactory.createForClass(Surfcamp);
