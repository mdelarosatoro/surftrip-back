import mongoose from 'mongoose';

export interface UserI {
    username: string;
    password: string;
    name: string;
    lastName: string;
}

export interface UserDbI {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    name: string;
    lastName: string;
    role: string;
}
