interface Freighter {
  signTransaction(
    transaction: string,
    networkPassphrase: string
  ): Promise<string>;
}

declare global {
  interface Window {
    freighter: Freighter;
  }
}

export {}; 