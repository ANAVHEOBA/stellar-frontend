'use client';

import { useState } from 'react';
import { useWallet } from '@/app/hooks/useWallet';
import { useMerchantAuth } from '@/app/hooks/useMerchantAuth';

export function MerchantConnect({ onSuccess }: { onSuccess?: () => void }) {
  const { isConnected, publicKey, isLoading, isFreighterAvailable } = useWallet();
  const { authenticateAsMerchant, isAuthenticating, error: authError } = useMerchantAuth();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      
      // Check if Freighter is available
      if (!isFreighterAvailable) {
        throw new Error('Please install Freighter wallet to continue');
      }

      // Attempt authentication
      await authenticateAsMerchant();
      
      // If successful, call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.error('Connection error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isFreighterAvailable && (
        <div className="text-amber-600 text-sm mb-4">
          Freighter wallet is required. Please install it to continue.
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isAuthenticating || !isFreighterAvailable}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isAuthenticating ? 'Connecting...' : 'Connect Merchant Wallet'}
      </button>

      {(error || authError) && (
        <div className="text-red-600 text-sm mt-2">
          {error || authError}
        </div>
      )}
    </div>
  );
} 