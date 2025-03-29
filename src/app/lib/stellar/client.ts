import * as StellarSdk from 'stellar-sdk';
import { server, networkConfig } from './config';

// Export networkConfig so it can be used in other files
export { networkConfig };

interface BuildPaymentParams {
  source: string;
  destination: string;
  amount: string;
  asset: string;
  memo?: string;
}

interface PaymentParams {
  destination: string;
  amount: string;
  asset: string;
  memo?: string;
}

declare global {
  interface Window {
    freighter: any;
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.freighter) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    await window.freighter.connect();
    const publicKey = await window.freighter.getPublicKey();
    return publicKey;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw new Error('Failed to connect wallet');
  }
}

export async function sendStellarPayment(params: PaymentParams) {
  if (!window.freighter) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    const { destination, amount, asset, memo } = params;

    // Build the transaction XDR
    const xdr = await buildPaymentXDR({
      destination,
      amount,
      asset: new StellarSdk.Asset(asset, 'STELLAR_ISSUER_ADDRESS'), // Replace with actual issuer
      memo
    });

    // Sign and submit using Freighter
    const signedXDR = await window.freighter.signTransaction(xdr);
    
    // Submit to network
    const response = await submitTransaction(signedXDR);
    
    return {
      hash: response.hash,
      success: true
    };
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Failed to send payment');
  }
}

// Helper function to build transaction XDR
async function buildPaymentXDR(params: any) {
  // Implementation will depend on your Stellar SDK setup
  // This is a placeholder - you'll need to implement the actual XDR building logic
  return "transaction_xdr_string";
}

export async function buildPaymentTransaction({
  source,
  destination,
  amount,
  asset,
  memo
}: BuildPaymentParams): Promise<string> {
  try {
    console.log('Loading account:', source);
    const account = await server.loadAccount(source);
    const fee = await server.fetchBaseFee();
    
    console.log('Building transaction with params:', {
      source,
      destination,
      amount,
      asset,
      memo
    });

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: networkConfig.networkPassphrase
    })
    .addOperation(StellarSdk.Operation.payment({
      destination,
      asset: asset === 'XLM' ? 
        StellarSdk.Asset.native() : 
        new StellarSdk.Asset(asset, networkConfig.issuer),
      amount: amount.toString()
    }));

    // Add memo if provided
    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }

    // Build and return XDR
    const builtTx = transaction.setTimeout(30).build();
    console.log('Transaction built successfully');
    return builtTx.toXDR();

  } catch (error) {
    console.error('Build transaction error:', error);
    throw error;
  }
}

export async function submitTransaction(signedXdr: string) {
  try {
    console.log('Submitting transaction...');
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      networkConfig.networkPassphrase
    );

    const response = await server.submitTransaction(transaction);
    console.log('Transaction submitted successfully:', response);
    
    return {
      success: true,
      hash: response.hash,
      ledger: response.ledger
    };
  } catch (error: any) {
    console.error('Submit transaction error:', error?.response?.data || error);
    throw new Error(
      error?.response?.data?.extras?.result_codes?.operations?.[0] || 
      error?.response?.data?.extras?.result_codes?.transaction || 
      'Transaction submission failed'
    );
  }
} 