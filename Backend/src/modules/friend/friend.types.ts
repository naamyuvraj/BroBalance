export interface SendRequestBody {
  to: string;
}

export interface FriendListItem {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  balance: number;
}

export interface PendingRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
}
