export type UserPlanType = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired';
export type PaymentStatus = 'captured' | 'authorized' | 'failed' | 'refunded' | 'pending';

export interface SubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: UserPlanType;
  status: SubscriptionStatus;
  paymentId?: string;
  amount: number;
  currency: string;
  startedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  amount: number; // in INR (or smallest currency unit)
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  notes?: Record<string, any>;
  paidAt: string;
  createdAt: string;
}

export interface AdminPaymentStats {
  totalRegisteredUsers: number;
  totalPremiumUsers: number;
  totalFreeUsers: number;
  totalSuccessfulPayments: number;
  totalFailedPayments: number;
  totalRevenue: number;
  currency: string;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: 'payment.captured' | 'payment.failed' | 'payment.authorized' | 'order.paid';
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id?: string;
        invoice_id?: string;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status?: string;
        captured: boolean;
        description?: string;
        card_id?: string;
        bank?: string;
        wallet?: string;
        vpa?: string;
        email: string;
        contact: string;
        notes: {
          userId?: string;
          userEmail?: string;
          userName?: string;
          plan?: string;
          [key: string]: any;
        };
        fee: number;
        tax: number;
        error_code?: string;
        error_description?: string;
        created_at: number;
      };
    };
  };
  created_at: number;
}
