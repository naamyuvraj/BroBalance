import { User } from './user.model.js';
import AppError from '../../utils/AppError.js';

class UserService {
    async getMe(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    async updateMe(userId: string, updates: { username?: string; mobileNumber?: string; instagramHandle?: string }) {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}

export default UserService;
