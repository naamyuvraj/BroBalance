// transaction.types.ts — types for transaction endpoints
//
// request bodies:
//   CreateTransactionBody {
//     friendId: string       — who the txn is with
//     amount: number         — how much (always positive)
//     type: 'lent' | 'borrowed'  — from the logged-in user's perspective
//     description: string    — what it was for ("pizza", "rent", etc)
//   }
//
//   MarkPaidBody {
//     paidAmount?: number    — if partial payment, otherwise full amount
//   }
//
// response shapes (what frontend expects):
//   TransactionItem {
//     _id: string
//     amount: number
//     type: 'lent' | 'borrowed'      — relative to requesting user
//     description: string
//     status: 'pending' | 'partial' | 'paid'
//     createdAt: string
//     friendName: string              — the other person's username
//     to: { username, avatarUrl }     — populated receiver
//     from: { username, avatarUrl }   — populated sender
//   }
//
//   DashboardStats {
//     totalFriends: number
//     toReceive: number              — total others owe you
//     toPay: number                  — total you owe others
//   }
//
// references:
//   - transaction.model.ts → ITransaction interface
//   - transctions.tsx (frontend) → shows what fields TransactionCard expects
//   - AddTransactionModal.tsx (frontend) → shows what create payload looks like
//   - dashboard.tsx (frontend) → stats shape { totalFriends, toReceive, toPay }
