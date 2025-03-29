'use client';

import { useState } from 'react';
import { CreateRateParams } from '@/app/lib/merchant/types';

interface CreateRateFormProps {
  onSubmit: (data: CreateRateParams) => Promise<void>;
  onCancel: () => void;
}

export function CreateRateForm({ onSubmit, onCancel }: CreateRateFormProps) {
  const [formData, setFormData] = useState<CreateRateParams>({
    baseCurrency: 'XLM',
    quoteCurrency: 'USD',
    rate: 0,
    validityPeriod: 30
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);
    setFormData({ 
      ...formData, 
      rate: isNaN(numberValue) ? 0 : numberValue 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Base Currency
        </label>
        <input
          type="text"
          value={formData.baseCurrency}
          onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
          className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 rounded-md border border-gray-300 
                   focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quote Currency
        </label>
        <input
          type="text"
          value={formData.quoteCurrency}
          onChange={(e) => setFormData({ ...formData, quoteCurrency: e.target.value })}
          className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 rounded-md border border-gray-300 
                   focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rate
        </label>
        <input
          type="number"
          step="0.000001"
          min="0"
          value={formData.rate.toString()}
          onChange={handleRateChange}
          className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 rounded-md border border-gray-300 
                   focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Validity Period (days)
        </label>
        <input
          type="number"
          min="1"
          value={formData.validityPeriod}
          onChange={(e) => setFormData({ 
            ...formData, 
            validityPeriod: parseInt(e.target.value) || 1 
          })}
          className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 rounded-md border border-gray-300 
                   focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                   rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Rate
        </button>
      </div>
    </form>
  );
} 