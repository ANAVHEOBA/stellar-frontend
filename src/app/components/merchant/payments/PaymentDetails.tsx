'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getPayment } from '@/app/lib/merchant/payment';
import type { Payment } from '@/app/lib/merchant/paymentTypes';
import { formatDate } from '@/app/utils/date';

interface PaymentDetailsProps {
  paymentId: string;
  onClose: () => void;
}

export function PaymentDetails({ paymentId, onClose }: PaymentDetailsProps) {
  const { token } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    if (token && paymentId) {
      fetchPaymentDetails();
    }
  }, [token, paymentId]);

  const fetchPaymentDetails = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getPayment(token, paymentId);
      setPayment(response.data.payment);
    } catch (err) {
      setError('Failed to load payment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${field} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : payment ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Status</h4>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Created</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Stellar Transaction Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Payment Address</p>
                  <div className="flex items-center">
                    <p className="text-sm font-mono text-gray-900">{payment.stellarPaymentAddress}</p>
                    <button
                      onClick={() => copyToClipboard(payment.stellarPaymentAddress, 'Address')}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Memo</p>
                  <p className="text-sm font-mono text-gray-900">{payment.stellarMemo}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Source Amount</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {payment.sourceAmount} {payment.sourceAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination Amount</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {payment.destinationAmount} {payment.destinationAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Exchange Rate</p>
                    <p className="text-sm font-semibold text-gray-900">
                      1 {payment.sourceAsset} = {payment.exchangeRate} {payment.destinationAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(payment.expiresAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">{payment.consumerEmail}</p>
                {payment.consumerWalletAddress && (
                  <div>
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p className="text-sm font-mono text-gray-900">{payment.consumerWalletAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {payment.paymentLink && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Link</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono text-gray-900 truncate">{payment.paymentLink}</p>
                  <button
                    onClick={() => copyToClipboard(payment.paymentLink!, 'Payment link')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {copySuccess && (
              <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
                {copySuccess}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
} 