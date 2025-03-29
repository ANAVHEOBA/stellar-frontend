'use client';

import { useState } from 'react';
import { MerchantRate } from '@/app/lib/merchant/types';
import { formatDate } from '@/app/utils/date';
import { RateDetails } from './RateDetails';

interface RatesListProps {
  rates: MerchantRate[];
  onCreateRate?: () => void;
}

export function RatesList({ rates, onCreateRate }: RatesListProps) {
  const [selectedRate, setSelectedRate] = useState<MerchantRate | null>(null);

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Exchange Rates</h3>
            <button
              onClick={onCreateRate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create New Rate
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr 
                  key={rate._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRate(rate)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rate.baseCurrency}/{rate.quoteCurrency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rate.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(rate.validTo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${rate.status === 'active' ? 'bg-green-100 text-green-800' : 
                        rate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {rate.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No rates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRate && (
        <RateDetails
          merchantId={selectedRate.merchantId}
          baseCurrency={selectedRate.baseCurrency}
          quoteCurrency={selectedRate.quoteCurrency}
          onClose={() => setSelectedRate(null)}
        />
      )}
    </>
  );
}