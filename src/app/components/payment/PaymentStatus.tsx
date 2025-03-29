'use client';

import { useState, useEffect } from 'react';
import { monitorPayment } from '@/app/lib/payment/client';

interface PaymentStatusProps {
  paymentId: string;
  initialStatus: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export function PaymentStatus({ paymentId, initialStatus, txHash }: PaymentStatusProps) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await monitorPayment(paymentId);
        
        if (response.data.status !== status) {
          setStatus(response.data.status);
        }

        if (response.data.status !== 'pending') {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError('Failed to check payment status');
        console.error('Monitor error:', err);
        clearInterval(intervalId);
      }
    };

    if (status === 'pending') {
      // Start polling immediately
      checkStatus();
      // Then poll every 5 seconds
      intervalId = setInterval(checkStatus, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentId, status]);

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${
        status === 'completed' ? 'bg-green-50 border border-green-200' :
        status === 'failed' ? 'bg-red-50 border border-red-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          {status === 'pending' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          )}
          <h3 className={`font-medium ${
            status === 'completed' ? 'text-green-900' :
            status === 'failed' ? 'text-red-900' :
            'text-yellow-900'
          }`}>
            {status === 'completed' ? 'Payment Completed' :
             status === 'failed' ? 'Payment Failed' :
             'Processing Payment'}
          </h3>
        </div>

        {txHash && (
          <div className="mt-3">
            <p className="text-sm text-gray-600">Transaction Hash:</p>
            <a
              href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono break-all text-blue-600 hover:underline"
            >
              {txHash}
            </a>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
} 