import { apiCall } from '../merchant/client';
import type { PaymentLinkResponse, PaymentMonitorResponse, UpdateConsumerWalletRequest } from './types';

export async function getPaymentByLink(paymentId: string) {
  return apiCall<PaymentLinkResponse>(`/api/payments/link/${paymentId}`);
}

export async function updateConsumerWallet(paymentId: string, data: UpdateConsumerWalletRequest) {
  return apiCall<PaymentLinkResponse>(`/api/payments/${paymentId}/consumer-wallet`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function monitorPayment(paymentId: string) {
  return apiCall<PaymentMonitorResponse>(`/api/payments/${paymentId}/monitor`);
} 