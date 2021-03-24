export interface AppOptions {
  symbols: string[];
  ignore: string[];
  currency: string;
  binance: {
    minCoinWalletValue: number;
  };
}
