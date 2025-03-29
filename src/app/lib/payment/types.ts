export interface PaymentLinkResponse {
  success: boolean;
  data: {
    payment: {
      _id: string;
      sourceAmount: string;
      sourceAsset: string;
      stellarPaymentAddress: string;
      stellarMemo?: string;
      expiresAt: string;
      status: 'pending' | 'completed' | 'failed';
      consumerWalletAddress?: string;
    };
  };
}

export interface PaymentMonitorResponse {
  success: boolean;
  data: {
    status: 'pending' | 'completed' | 'failed';
    expiresAt: string;
    updatedAt: string;
  };
}

export interface UpdateConsumerWalletRequest {
  consumerWalletAddress: string;
} 