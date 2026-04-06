import mongoose, { Schema, Document } from "mongoose";

export interface  IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    mobileNumber: string;
    instagramHandle: string;
}

const UserSchema:Schema =new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true,lowercase: true, trim: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    instagramHandle: { type: String},
}, {
    timestamps: true,
});

UserSchema.index({ email: 1 }, { unique: true });
export const User = mongoose.model<IUser>('User', UserSchema);