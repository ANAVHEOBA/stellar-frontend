'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { createPaymentRequest } from '@/app/lib/merchant/payment';
import type { MerchantRate } from '@/app/lib/merchant/types';

interface CreatePaymentRequestProps {
  rate: MerchantRate;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePaymentRequest({ rate, onClose, onSuccess }: CreatePaymentRequestProps) {
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    address: string;
    memo?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await createPaymentRequest(token, {
        rateId: rate._id,
        sourceAmount: amount,
        customerEmail: email
      });

      setPaymentInfo({
        address: response.data.payment.stellarPaymentAddress,
        memo: response.data.payment.stellarMemo
      });
      
      onSuccess();
    } catch (err) {
      setError('Failed to create payment request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Payment Request
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {paymentInfo ? (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-medium">Payment Request Created!</p>
              <p className="text-green-600 mt-1">
                Payment instructions have been sent to {email}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Address
                  </label>
                  <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm break-all">
                    {paymentInfo.address}
                  </div>
                </div>
                {paymentInfo.memo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Memo
                    </label>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                      {paymentInfo.memo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 
                       rounded-lg font-medium shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({rate.baseCurrency})
              </label>
              <input
                type="number"
                step="0.0000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
              {amount && (
                <p className="mt-2 text-sm text-gray-600">
                  ≈ {(parseFloat(amount) * rate.rate).toFixed(7)} {rate.quoteCurrency}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="customer@example.com"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 
                         rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 
                         rounded-lg font-medium shadow-sm transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 