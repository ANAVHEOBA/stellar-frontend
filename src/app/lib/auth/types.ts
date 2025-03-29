export type UserType = 'consumer' | 'merchant';

export interface User {
  _id: string;
  walletAddress: string;
  userType: UserType;
  isActive: boolean;
  lastLogin: string;
  // Merchant specific fields
  merchantDetails?: {
    businessName?: string;
    businessType?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ChallengeResponse {
  success: boolean;
  data: {
    transaction: string;
    networkPassphrase: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface TokenValidResponse {
  success: boolean;
  valid: boolean;
}

export interface ApiError {
  success: false;
  error: string;
}

// Add merchant-specific challenge type
export interface MerchantChallengeResponse extends ChallengeResponse {
  data: {
    transaction: string;
    networkPassphrase: string;
    merchantVerification?: boolean;
  };
} 