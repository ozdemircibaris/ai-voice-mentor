export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name?: string;
  auth0Id: string;
  avatarUrl?: string;
  isPremium: boolean;
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  plan: "free" | "premium" | "business";
  status: "active" | "cancelled" | "trialing";
  startDate: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
}
