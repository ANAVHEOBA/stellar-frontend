import { useState } from 'react';
import { useRouter } from 'next/navigation';
import freighterApi from "@stellar/freighter-api";
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from './useWallet';
import { getMerchantChallenge, verifyMerchantChallenge } from '../lib/merchant/client';

export function useMerchantAuth() {
  const router = useRouter();
  const { login } = useAuth();
  const { publicKey, isFreighterAvailable, checkWallet } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateAsMerchant = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);

      if (!isFreighterAvailable) {
        throw new Error('Freighter wallet is not available');
      }

      // Request wallet access first
      const accessResponse = await freighterApi.requestAccess();
      if (accessResponse.error) {
        throw new Error(accessResponse.error);
      }

      // Refresh wallet state
      await checkWallet();

      // Get the current public key
      const walletAddress = accessResponse.address;
      if (!walletAddress) {
        throw new Error('No public key available');
      }

      // Get the challenge from the server
      const challengeResponse = await getMerchantChallenge(walletAddress);
      
      if (!challengeResponse.success) {
        throw new Error('Failed to get authentication challenge');
      }

      // Sign the challenge transaction
      const { transaction, networkPassphrase } = challengeResponse.data;
      
      const signResult = await freighterApi.signTransaction(transaction, {
        networkPassphrase
      });

      // Verify the signed challenge
      const authResponse = await verifyMerchantChallenge({
        signedChallenge: signResult.signedTxXdr,
        walletAddress: walletAddress
      });

      if (!authResponse.success) {
        throw new Error('Failed to verify merchant authentication');
      }

      // Store the authentication token
      await login(authResponse.data.token);

      // Navigate to dashboard after successful authentication
      router.push('/merchant/dashboard');

      return authResponse.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    authenticateAsMerchant,
    isAuthenticating,
    error
  };
} 