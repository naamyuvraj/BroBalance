export interface CreateTransactionBody {
  friendId: string;
  amount: number;
  type: 'lent' | 'borrowed';
  description: string;
}

export interface MarkPaidBody {
  paidAmount?: number;
}

export interface TransactionItem {
  _id: string;
  amount: number;
  paidAmount: number;
  description: string;
  status: 'pending' | 'partial' | 'paid';
  createdAt: string;
  type: 'lent' | 'borrowed';
  friendName: string;
  to: { username: string; avatarUrl: string };
  from: { username: string; avatarUrl: string };
}

export interface DashboardStats {
  totalFriends: number;
  toReceive: number;
  toPay: number;
}  