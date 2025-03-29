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

  useEffect(() => {
    if (token && paymentId) {
      fetchPaymentDetails();
    }
  }, [token, paymentId]);

  const fetchPaymentDetails = async () => {
    if (!token) return; // Early return if no token

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Source Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.sourceAmount} {payment.sourceAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.destinationAmount} {payment.destinationAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Exchange Rate</p>
                    <p className="text-sm font-medium text-gray-900">
                      1 {payment.sourceAsset} = {payment.exchangeRate} {payment.destinationAsset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(payment.expiresAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
              <p className="text-sm text-gray-900">{payment.customerEmail}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Reference IDs</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="text-sm font-mono text-gray-900">{payment._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rate ID</p>
                  <p className="text-sm font-mono text-gray-900">{payment.rateId}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 