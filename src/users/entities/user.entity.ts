import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
        required: true,
    })
    bookings: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
