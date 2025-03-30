'use client';

import { useState } from 'react';
import { formatDate } from '@/app/utils/date';
import type { Payment } from '@/app/lib/merchant/paymentTypes';
import { PaymentDetails } from './PaymentDetails';

interface PaymentsListProps {
  payments: Payment[];
  loading: boolean;
}

export function PaymentsList({ payments, loading }: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // Could add toast notification here
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

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading payments...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No payments found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stellar Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.sourceAmount} {payment.sourceAsset} →{' '}
                  {payment.destinationAmount} {payment.destinationAsset}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.consumerEmail}</div>
                  {payment.consumerWalletAddress && (
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {payment.consumerWalletAddress}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {payment.stellarPaymentAddress}
                    <button 
                      onClick={() => copyToClipboard(payment.stellarPaymentAddress)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Memo: {payment.stellarMemo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedPayment(payment._id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Details
                  </button>
                  {payment.paymentLink && (
                    <button
                      onClick={() => copyToClipboard(payment.paymentLink!)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Copy Link
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <PaymentDetails
          paymentId={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
} 