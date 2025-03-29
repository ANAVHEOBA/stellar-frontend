'use client';

import { useState, useEffect } from 'react';
import { getMerchantRate, checkRateViability } from '@/app/lib/merchant/client';
import { MerchantRate, RateViabilityCheck } from '@/app/lib/merchant/types';
import { formatDate } from '@/app/utils/date';
import { useAuth } from '@/app/contexts/AuthContext';
import { CreatePaymentRequest } from '@/app/components/merchant/payments/CreatePaymentRequest';

interface RateDetailsProps {
  merchantId: string;
  baseCurrency: string;
  quoteCurrency: string;
  onClose: () => void;
}

export function RateDetails({ merchantId, baseCurrency, quoteCurrency, onClose }: RateDetailsProps) {
  const { token } = useAuth();
  const [rate, setRate] = useState<MerchantRate | null>(null);
  const [viability, setViability] = useState<RateViabilityCheck | null>(null);
  const [amount, setAmount] = useState('100.0000000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentRequest, setShowPaymentRequest] = useState(false);

  const formatAmount = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      parts.splice(2);
    }
    
    const num = parseFloat(parts.join('.'));
    if (isNaN(num)) return '0.0000000';
    
    return num.toFixed(7);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '' || value === '.') {
      setAmount(value);
      return;
    }

    setAmount(formatAmount(value));
  };

  const fetchRateDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMerchantRate(merchantId, baseCurrency, quoteCurrency);
      setRate(response.data.rate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate details');
    } finally {
      setLoading(false);
    }
  };

  const checkViability = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await checkRateViability(merchantId, token, {
        baseCurrency,
        quoteCurrency,
        amount: formatAmount(amount)
      });
      setViability(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check viability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateDetails();
  }, [merchantId, baseCurrency, quoteCurrency]);

  if (loading && !rate) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {rate && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Rate Details: {rate.baseCurrency}/{rate.quoteCurrency}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-medium text-gray-500">Rate</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{rate.rate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className={`mt-1 inline-flex text-sm font-semibold rounded-full px-2 py-1
                  ${rate.status === 'active' ? 'bg-green-100 text-green-800' : 
                    rate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {rate.status}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-medium text-gray-500">Valid From</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(rate.validFrom)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-medium text-gray-500">Valid To</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(rate.validTo)}</p>
              </div>
            </div>

            <div className="border-t pt-6 flex justify-between">
              <button
                onClick={() => setShowPaymentRequest(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!rate || rate.status !== 'active'}
              >
                Create Payment Request
              </button>
              <button
                onClick={checkViability}
                disabled={loading || !amount || parseFloat(amount) === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                          disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
              >
                {loading ? 'Checking...' : 'Check Viability'}
              </button>
            </div>

            {viability && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Viability</span>
                    <span className={`text-sm font-semibold ${
                      viability.isViable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {viability.isViable ? 'Viable' : 'Not Viable'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Expected Amount</span>
                    <span className="text-sm text-gray-900">
                      {viability.expectedDestinationAmount} {quoteCurrency}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Rate</span>
                    <span className="text-sm text-gray-900">
                      1 {baseCurrency} = {viability.rate} {quoteCurrency}
                    </span>
                  </div>
                </div>

                {viability.viabilityDetails && (
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <h4 className="font-medium text-gray-900">Additional Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-500">Best Path</p>
                        <p className="text-gray-900">
                          {viability.viabilityDetails.paths.bestPath.join(' → ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Liquidity</p>
                        <p className="text-gray-900">
                          {viability.viabilityDetails.liquidity.sufficient ? 'Sufficient' : 'Insufficient'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showPaymentRequest && rate && (
          <CreatePaymentRequest
            rate={rate}
            onClose={() => setShowPaymentRequest(false)}
            onSuccess={() => {
              setShowPaymentRequest(false);
              // Optionally refresh rate details
              fetchRateDetails();
            }}
          />
        )}
      </div>
    </div>
  );
} 