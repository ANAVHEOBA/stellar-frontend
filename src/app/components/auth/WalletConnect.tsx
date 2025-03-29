'use client';

import { useState } from 'react';
import freighterApi from "@stellar/freighter-api";
import { getAuthChallenge, verifyChallenge } from '../../lib/auth/client';
import { useWallet } from '@/app/hooks/useWallet';
import { useAuth } from '@/app/contexts/AuthContext';

export function WalletConnect() {
  const { isConnected, publicKey, isLoading, isFreighterAvailable, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logoutUser } = useAuth();

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!isFreighterAvailable) {
        throw new Error('Please install Freighter wallet and refresh the page');
      }

      // Add delay to ensure Freighter is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Request access and get public key
      const accessResponse = await freighterApi.requestAccess();
      if (accessResponse.error) {
        throw new Error(accessResponse.error);
      }
      
      const publicKey = accessResponse.address;
      console.log('Public key:', publicKey);

      // Get challenge
      const challengeResponse = await getAuthChallenge(publicKey);
      console.log('Challenge response:', challengeResponse);

      if (!challengeResponse.success || !challengeResponse.data) {
        throw new Error('Failed to get auth challenge');
      }

      const { transaction, networkPassphrase } = challengeResponse.data;
      
      if (!transaction || !networkPassphrase) {
        throw new Error('Invalid challenge response format');
      }

      // Sign transaction
      const signedResponse = await freighterApi.signTransaction(transaction, {
        networkPassphrase
      });

      if (signedResponse.error) {
        throw new Error(signedResponse.error);
      }

      console.log('Signed response:', signedResponse);

      // Verify and get token
      const verifyResponse = await verifyChallenge({
        signedChallenge: signedResponse.signedTxXdr,
        walletAddress: publicKey,
        userType: 'consumer'
      });

      console.log('Verify response:', verifyResponse);

      if (!verifyResponse.success || !verifyResponse.data?.token) {
        throw new Error('Failed to verify challenge');
      }

      // After getting the token, use the login function
      await login(verifyResponse.data.token);
      console.log('Successfully connected wallet');

    } catch (error) {
      console.error('Connection failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logoutUser();
      disconnectWallet();
    } catch (error) {
      console.error('Disconnect failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect wallet');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show connected state with disconnect button
  if (isConnected && publicKey) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm font-medium">
          Connected: {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </div>
        <button 
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  // Show connect button state
  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={connectWallet}
        disabled={isConnecting || !isFreighterAvailable}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isConnecting ? 'Connecting...' : 
         !isFreighterAvailable ? 'Install Freighter' : 'Connect Wallet'}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
          {!isFreighterAvailable && (
            <a 
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:underline"
            >
              Install Freighter
            </a>
          )}
        </div>
      )}

      <div className="text-sm text-gray-600 mt-4">
        <p className="font-medium mb-2">Troubleshooting steps:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Make sure Freighter is installed</li>
          <li>Check if Freighter is enabled in Chrome extensions</li>
          <li>Try refreshing the page</li>
          <li>Make sure you're on Testnet in Freighter</li>
        </ol>
      </div>
    </div>
  );
} 