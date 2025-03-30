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
  stellarPaymentAddress: string;
  stellarMemo: string;
  merchantWalletAddress: string;
  consumerEmail: string;
  consumerWalletAddress?: string;
  paymentLink?: string;
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