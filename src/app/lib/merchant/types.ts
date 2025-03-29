export interface MerchantRate {
  _id: string;
  merchantId: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  validFrom: string;
  validTo: string;
  status: 'pending' | 'active' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRateParams {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  validityPeriod: number;
}

export interface RateViabilityCheck {
  isViable: boolean;
  rate: number;
  expectedDestinationAmount: string;
  viabilityDetails?: {
    paths: {
      direct: boolean;
      indirect: boolean;
      bestPath: string[];
    };
    liquidity: {
      poolLiquidity: number;
      orderbookDepth: number;
      sufficient: boolean;
    };
    pricing: {
      currentPrice: number;
      slippage: number;
      priceImpact: number;
    };
    volume: {
      last24Hours: number;
      averageTradeSize: number;
    };
    trustlines: {
      source: boolean;
      destination: boolean;
    };
  };
}

export interface RateResponse {
  success: boolean;
  data: {
    rate: MerchantRate;
  };
}

export interface RatesListResponse {
  success: boolean;
  data: {
    rates: MerchantRate[];
  };
}

export interface RateViabilityResponse {
  success: boolean;
  data: RateViabilityCheck;
}

export interface CheckViabilityParams {
  baseCurrency: string;
  quoteCurrency: string;
  amount: string;
} 