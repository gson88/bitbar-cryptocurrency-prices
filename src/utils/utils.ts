import type { FullPriceAPIResponse } from '../types/api.types';
import { AppOptions } from '../types/app.types';
import type { FixedBalance, UserCoinValues } from '../types/binance.types';

export const getValuesForUserCoins = (
  userBalance: FixedBalance[],
  priceData: FullPriceAPIResponse,
  currency: string,
  minCoinWalletValue = 0
): UserCoinValues => {
  return userBalance.reduce<UserCoinValues>((acc, balance) => {
    const { coin, free } = balance;
    if (!priceData.RAW[coin]) {
      return acc;
    }

    const coinPrice = Number(priceData.RAW[coin][currency].PRICE);
    const quantity = free; //; + coin.locked;
    const value = Math.round(coinPrice * quantity);

    if (value >= minCoinWalletValue) {
      acc[coin] = {
        coin,
        value,
        quantity,
      };
    }

    return acc;
  }, {});
};

/**
 * Remove ignored symbols
 * Add additional symbols
 */
export const addSymbolsFromOptions = (
  symbols: string[],
  appOptions: AppOptions
) => {
  return (
    symbols
      .filter((symbol) => !appOptions.ignore.includes(symbol))
      .concat(appOptions.symbols)
      // Remove doubles
      .filter((symbol, index, full) => {
        return full.findIndex((s) => s === symbol) === index;
      })
  );
};
