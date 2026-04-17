export type NotificationType =
  | "friend_request"
  | "friend_accepted"
  | "transaction_request"
  | "transaction_paid"
  | "reminder"
  | "message";

export interface INotificationPayload {
  fromUserId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, any>; // e.g. { friendRequestId, transactionId, etc. }
}
