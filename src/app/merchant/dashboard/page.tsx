'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { RatesList } from '@/app/components/merchant/dashboard/RatesList';
import { CreateRateForm } from '@/app/components/merchant/dashboard/CreateRateForm';
import { createRate, getMerchantRates } from '@/app/lib/merchant/client';
import type { MerchantRate, CreateRateParams, RatesListResponse } from '@/app/lib/merchant/types';

export default function MerchantDashboard() {
  const { token } = useAuth();
  const [rates, setRates] = useState<MerchantRate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch merchant rates
  const fetchRates = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getMerchantRates(token) as RatesListResponse;
      if (response.success) {
        setRates(response.data.rates);
      }
    } catch (err) {
      setError('Failed to load rates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load rates on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchRates();
    }
  }, [token]);

  // Handle rate creation
  const handleCreateRate = async (data: CreateRateParams) => {
    if (!token) return;
    
    try {
      setError(null);
      await createRate(token, data);
      await fetchRates(); // Refresh rates list
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create rate');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your exchange rates and view performance metrics
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Rates</h3>
          <p className="text-3xl font-bold text-blue-600">
            {rates.filter(rate => rate.status === 'active').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Rates</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {rates.filter(rate => rate.status === 'pending').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Expired Rates</h3>
          <p className="text-3xl font-bold text-red-600">
            {rates.filter(rate => rate.status === 'expired').length}
          </p>
        </div>
      </div>

      {isCreating ? (
        <CreateRateForm
          onSubmit={handleCreateRate}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <RatesList
          rates={rates}
          onCreateRate={() => setIsCreating(true)}
        />
      )}
    </div>
  );
} 