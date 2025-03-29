'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { PaymentsList } from '@/app/components/merchant/payments/PaymentsList';
import { getMerchantPayments } from '@/app/lib/merchant/payment';
import type { Payment } from '@/app/lib/merchant/paymentTypes';

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchPayments = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const response = await getMerchantPayments(token, status);
      setPayments(response.data.payments);
    } catch (err) {
      setError('Failed to load payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token, selectedStatus]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your payment transactions
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Payments</h3>
          <p className="text-3xl font-bold text-blue-600">
            {payments.length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {payments.filter(payment => payment.status === 'pending').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {payments.filter(payment => payment.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        
        <PaymentsList 
          payments={payments}
          loading={loading}
        />
      </div>
    </div>
  );
} 