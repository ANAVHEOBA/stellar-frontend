import { useState, useEffect } from 'react';
import freighterApi from "@stellar/freighter-api";
import { buildPaymentTransaction, submitTransaction, networkConfig } from '@/app/lib/stellar/client';
import { server } from '@/app/lib/stellar/config';

interface SendPaymentParams {
  destination: string;
  amount: string;
  asset: string;
  memo?: string;
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);

  const checkFreighterAvailability = () => {
    // Wait for window to be defined and check both window.freighter and freighterApi
    const isAvailable = typeof window !== 'undefined' && 
      (window.freighter !== undefined || typeof freighterApi !== 'undefined');
    console.log('Window freighter:', window.freighter);
    console.log('Freighter API:', freighterApi);
    console.log('Freighter availability:', isAvailable);
    setIsFreighterAvailable(isAvailable);
    return isAvailable;
  };

  const checkWallet = async () => {
    try {
      console.log('Checking wallet...');
      setIsLoading(true);

      // Add delay to ensure Freighter is loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!checkFreighterAvailability()) {
        console.log('Freighter not available');
        throw new Error('Please install Freighter wallet and refresh the page');
      }

      // Check if already connected using freighterApi
      console.log('Checking connection status...');
      try {
        const { isConnected: isWalletConnected } = await freighterApi.isConnected();
        console.log('Wallet connected:', isWalletConnected);

        if (!isWalletConnected) {
          console.log('Requesting access...');
          await freighterApi.requestAccess();
        }

        // Get public key
        console.log('Getting public key...');
        const addressResponse = await freighterApi.getAddress();
        console.log('Public key received:', addressResponse);

        if (addressResponse.address) {
          setPublicKey(addressResponse.address);
          setIsConnected(true);
          console.log('Wallet successfully connected');
        } else {
          throw new Error('Failed to get public key');
        }
      } catch (error) {
        console.error('Freighter API error:', error);
        throw new Error('Please unlock your Freighter wallet and try again');
      }

    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsFreighterAvailable(false);
      setIsConnected(false);
      setPublicKey(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkDestinationAccount = async (destinationAddress: string) => {
    try {
      console.log('Validating destination account:', destinationAddress);
      const account = await server.loadAccount(destinationAddress);
      console.log('Destination account exists:', account.id);
      return true;
    } catch (error) {
      console.error('Destination account validation failed:', error);
      throw new Error('Destination account does not exist or is not funded');
    }
  };

  const sendPayment = async ({ destination, amount, asset, memo }: SendPaymentParams) => {
    if (!isConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // Validate destination account first
      await checkDestinationAccount(destination);

      console.log('Building payment transaction...', {
        source: publicKey,
        destination,
        amount,
        asset,
        memo
      });

      const transaction = await buildPaymentTransaction({
        source: publicKey,
        destination,
        amount,
        asset,
        memo
      });

      console.log('Signing transaction...');
      const signedResponse = await freighterApi.signTransaction(transaction, {
        networkPassphrase: networkConfig.networkPassphrase
      });

      if (signedResponse.error) {
        console.error('Signing error:', signedResponse.error);
        throw new Error(signedResponse.error);
      }

      console.log('Submitting transaction...');
      const result = await submitTransaction(signedResponse.signedTxXdr);
      console.log('Transaction submitted:', result);
      return result;

    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...');
    setIsConnected(false);
    setPublicKey(null);
  };

  // Check wallet availability on mount
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        await checkWallet();
      } catch (error) {
        console.error('Initial wallet check failed:', error);
      }
    };

    checkInitialState();
  }, []);

  return {
    isConnected,
    publicKey,
    isLoading,
    isFreighterAvailable,
    checkWallet,
    disconnectWallet,
    sendPayment,
    checkDestinationAccount
  };
} 