import type { MerchantChallengeResponse, AuthResponse } from '../auth/types';
import type { RatesListResponse, RateResponse, RateViabilityResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function for API calls - now exported
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export async function getMerchantChallenge(walletAddress: string) {
  return apiCall<MerchantChallengeResponse>('/api/auth/challenge', {
    method: 'POST',
    body: JSON.stringify({ walletAddress })
  });
}

export async function verifyMerchantChallenge(params: {
  signedChallenge: string;
  walletAddress: string;
}) {
  return apiCall<AuthResponse>('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      userType: 'merchant'
    })
  });
}

export async function getMerchantProfile(token: string) {
  return apiCall('/api/merchant/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function updateMerchantProfile(token: string, data: {
  businessName: string;
  businessType: string;
  description?: string;
  website?: string;
  email: string;
}) {
  return apiCall('/api/merchant/profile', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function createRate(token: string, data: {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  validityPeriod: number;
}) {
  return apiCall<RatesListResponse>('/api/rates', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function getMerchantRates(token: string) {
  return apiCall<RatesListResponse>('/api/rates/merchant', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function getMerchantRate(merchantId: string, baseCurrency: string, quoteCurrency: string) {
  return apiCall<RateResponse>(`/api/rates/${merchantId}/${baseCurrency}/${quoteCurrency}`);
}

export async function checkRateViability(merchantId: string, token: string, data: {
  baseCurrency: string;
  quoteCurrency: string;
  amount: string;
}) {
  return apiCall<RateViabilityResponse>(`/api/rates/check-viability/${merchantId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
} 