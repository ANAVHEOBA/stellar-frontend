import type { ChallengeResponse, AuthResponse, UserResponse, TokenValidResponse, UserType } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API call failed');
  }

  return response.json();
}

export async function getAuthChallenge(walletAddress: string) {
  return apiCall<ChallengeResponse>('/api/auth/challenge', {
    method: 'POST',
    body: JSON.stringify({ walletAddress })
  });
}

export async function verifyChallenge(params: {
  signedChallenge: string;
  walletAddress: string;
  userType: UserType;
}) {
  return apiCall<AuthResponse>('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export async function getMe(token: string) {
  return apiCall<UserResponse>('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function checkToken(token: string) {
  return apiCall<TokenValidResponse>('/api/auth/check-token', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function refreshToken(token: string) {
  return apiCall<AuthResponse>('/api/auth/refresh-token', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function logout(token: string) {
  return apiCall('/api/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
} 