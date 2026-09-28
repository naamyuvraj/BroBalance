

export interface UpdateUserBody {
    username?: string;
    email?: string;
    mobileNumber?: string;
    instagramHandle?: string;
    avatarUrl?: string;
}

export interface SearchUserResult {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
} 