export interface Payment {
  _id: string;
  merchantId: string;
  rateId: string;
  type: 'crypto';
  status: 'pending' | 'completed' | 'failed';
  sourceAmount: string;
  sourceAsset: string;
  destinationAmount: string;
  destinationAsset: string;
  exchangeRate: number;
  customerEmail: string;
  paymentAddress?: string;  // Stellar address for customer to pay to
  memo?: string;           // Optional memo for the payment
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequestParams {
  rateId: string;
  sourceAmount: string;
  customerEmail: string;
}

export interface PaymentListResponse {
  success: boolean;
  data: {
    payments: Payment[];
    total: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
  };
}

export interface CreatePaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
  };
} 