'use client';

import { useState, useEffect } from 'react';
import { getPaymentByLink } from '@/app/lib/payment/client';
import { WalletSection } from './WalletSection';
import { PaymentStatus } from './PaymentStatus';
import type { PaymentLinkResponse } from '@/app/lib/payment/types';

interface PaymentPageProps {
  paymentId: string;
}

export function PaymentPage({ paymentId }: PaymentPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentLinkResponse['data']['payment'] | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadPayment() {
      try {
        setLoading(true);
        setError(null);
        const response = await getPaymentByLink(paymentId);
        setPayment(response.data.payment);
      } catch (err) {
        setError('Failed to load payment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [paymentId]);

  const handlePaymentSent = (hash: string) => {
    setTxHash(hash);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error || 'Payment not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Your Payment
            </h1>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">Amount:</span>
                  <span className="text-gray-900 font-semibold">
                    {payment.sourceAmount} {payment.sourceAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-medium">Expires:</span>
                  <span className="text-gray-900 font-semibold">
                    {new Date(payment.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {payment.status === 'pending' ? (
                <WalletSection 
                  payment={payment} 
                  onPaymentSent={handlePaymentSent}
                />
              ) : (
                <PaymentStatus 
                  paymentId={payment._id}
                  initialStatus={payment.status}
                  txHash={txHash}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 