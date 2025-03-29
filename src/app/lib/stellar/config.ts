import * as StellarSdk from 'stellar-sdk';

// Use environment variables for network configuration
const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'TESTNET';
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
const ISSUER = process.env.NEXT_PUBLIC_ISSUER || 'GBXV4VLTLSPMQH7HMKZLMR6ZKMFED5F5WPREQLXDCZRPNXG4FQQHV32W';

// Initialize Stellar server
export const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Network configuration
export const networkConfig = {
  network: NETWORK,
  horizonUrl: HORIZON_URL,
  networkPassphrase: NETWORK_PASSPHRASE,
  issuer: ISSUER
}; 