import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    mobileNumber?: string;
    instagramHandle?: string;
}

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },
    mobileNumber: { type: String },
    instagramHandle: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
            return ret;
        },
    },
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password as string, 10);
});

export const User = mongoose.model<IUser>('User', UserSchema);