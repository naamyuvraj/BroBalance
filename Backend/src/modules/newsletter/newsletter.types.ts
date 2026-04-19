export interface ISubscriber {
  email: string;
  subscribedAt: Date;
  active: boolean;
}

export interface SubscribeBody {
  email: string;
}

export interface SendNewsletterBody {
  subject: string;
  html: string;
}
