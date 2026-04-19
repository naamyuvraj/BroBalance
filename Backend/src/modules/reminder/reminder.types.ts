// reminder.types.ts — types for reminder endpoints
//
// request bodies:
//   CreateReminderBody {
//     transactionId: string
//     message?: string       — custom nudge text
//     scheduledAt?: string   — ISO date, or omit for immediate
//   }
//
// response shapes:
//   ReminderItem {
//     _id: string
//     transaction: {
//       _id: string
//       amount: number
//       description: string
//     }
//     from: { username: string, avatarUrl?: string }
//     message?: string
//     status: 'pending' | 'sent' | 'cancelled'
//     scheduledAt?: string
//     sentAt?: string
//     createdAt: string
//   }
//
// references:
//   - reminder.model.ts → IReminder interface
//   - transaction.types.ts → the linked transaction shape
