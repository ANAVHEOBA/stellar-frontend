'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/app/hooks/useWallet';
import { updateConsumerWallet } from '@/app/lib/payment/client';

interface WalletSectionProps {
  payment: {
    _id: string;
    sourceAmount: string;
    sourceAsset: string;
    stellarPaymentAddress: string;
    stellarMemo?: string;
  };
  onPaymentSent: (txHash: string) => void;
}

export function WalletSection({ payment, onPaymentSent }: WalletSectionProps) {
  const { 
    isConnected, 
    publicKey, 
    isLoading, 
    isFreighterAvailable, 
    checkWallet,
    sendPayment
  } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update backend when wallet is connected
  useEffect(() => {
    if (isConnected && publicKey) {
      updateConsumerWallet(payment._id, { consumerWalletAddress: publicKey })
        .catch(err => console.error('Failed to update consumer wallet:', err));
    }
  }, [isConnected, publicKey, payment._id]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await checkWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await sendPayment({
        destination: payment.stellarPaymentAddress,
        amount: payment.sourceAmount,
        asset: payment.sourceAsset,
        memo: payment.stellarMemo
      });

      onPaymentSent(result.hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isFreighterAvailable && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">
            Please install Freighter wallet to continue
            <a 
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:underline"
            >
              Install Freighter
            </a>
          </p>
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={!isFreighterAvailable || loading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 font-medium transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
            <p className="font-mono text-sm break-all">{publicKey}</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg 
                     hover:bg-green-700 font-medium transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Payment...' : 'Send Payment'}
          </button>
        </div>
      )}
    </div>
  );
} 