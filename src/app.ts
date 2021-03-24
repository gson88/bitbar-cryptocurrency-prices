import bitbar from 'bitbar';
import type { BitbarRow } from './types/api.types';
import type { AppOptions } from './types/app.types';
import type { FixedBalance } from './types/binance.types';
import * as binanceAPI from './binance/api';
import * as bitbarUtils from './bitbar/utils';
import * as cryptoCompareAPI from './cryptocompare/api';
import * as options from './options/options';
import * as utils from './utils/utils';

export const getRows = async (): Promise<BitbarRow[]> => {
  const appOptions = options.getOptions();

  if (binanceAPI.hasEnvironmentKeys()) {
    return getRowsWithBinance(appOptions);
  } else {
    return getRowsWithoutBinance(appOptions);
  }
};

const getRowsWithBinance = async (
  appOptions: AppOptions
): Promise<BitbarRow[]> => {
  let symbols: string[];
  let userBalance: FixedBalance[];

  try {
    ({ symbols, userBalance } = await binanceAPI.getUserAccuntBalances());
  } catch (error) {
    throw new Error('Binance integration failed');
  }

  symbols = utils.addSymbolsFromOptions(symbols, appOptions);

  const priceData = await cryptoCompareAPI.getPrices(
    symbols,
    appOptions.currency
  );

  const coinValues = utils.getValuesForUserCoins(
    userBalance,
    priceData,
    appOptions.currency,
    appOptions.binance.minCoinWalletValue
  );

  const sortedSymbols = symbols.sort((a, b) => {
    return coinValues[a]?.value > coinValues[b]?.value ? -1 : 1;
  });

  const rows = await bitbarUtils.getBitbarRows({
    currency: appOptions.currency,
    prices: priceData,
    symbols: sortedSymbols,
    coinValues: coinValues,
  });

  rows.push(bitbar.separator, bitbarUtils.getTotalWalletValueRow(coinValues));
  return rows;
};

const getRowsWithoutBinance = async (
  appOptions: AppOptions
): Promise<BitbarRow[]> => {
  const priceData = await cryptoCompareAPI.getPrices(
    appOptions.symbols,
    appOptions.currency
  );

  return bitbarUtils.getBitbarRows({
    prices: priceData,
    symbols: appOptions.symbols,
    currency: appOptions.currency,
  });
};
