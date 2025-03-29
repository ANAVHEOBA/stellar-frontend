import type { 
  CreatePaymentRequestParams, 
  PaymentResponse, 
  PaymentListResponse, 
  CreatePaymentResponse 
} from './paymentTypes';
import { apiCall } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createPaymentRequest(token: string, data: CreatePaymentRequestParams) {
  return apiCall<CreatePaymentResponse>('/api/payments', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function getMerchantPayments(token: string, status?: string) {
  const queryString = status ? `?status=${status}` : '';
  return apiCall<PaymentListResponse>(`/api/payments/merchant${queryString}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function getPayment(token: string, paymentId: string) {
  return apiCall<PaymentResponse>(`/api/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
} 