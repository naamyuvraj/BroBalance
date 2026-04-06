import mongoose,{Schema,Document} from "mongoose";

export interface IFriend extends Document{
    userId: mongoose.Types.ObjectId;
    friendId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const FriendSchema:Schema = new Schema<IFriend>({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    friendId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, {
    timestamps: true,
});

FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const Friend = mongoose.model<IFriend>('Friend', FriendSchema);