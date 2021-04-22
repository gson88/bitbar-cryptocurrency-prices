import bitbar from 'bitbar';
import type { BitbarRow } from './types/api.types';
import type { AppOptions } from './types/app.types';
import type { FixedBalance } from './types/binance.types';
import type { Thread } from './types/4chan.types';
import * as chanAPI from './4chan/api';
import * as binanceAPI from './binance/api';
import * as bitbarUtils from './bitbar/utils';
import * as cryptoCompareAPI from './cryptocompare/api';
import * as options from './options/options';
import * as utils from './utils/utils';

export const getRows = async (): Promise<BitbarRow[]> => {
  const appOptions = options.getOptions();
  const threads = await chanAPI.getCatalogThreads();

  if (binanceAPI.hasEnvironmentKeys()) {
    return getRowsWithBinance(appOptions, threads);
  } else {
    return getRowsWithoutBinance(appOptions, threads);
  }
};

const getRowsWithBinance = async (
  appOptions: AppOptions,
  threads: Thread[]
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
    const value1 = coinValues[a]?.value || 0;
    const value2 = coinValues[b]?.value || 0;
    return value1 > value2 ? -1 : 1;
  });

  const rows = await bitbarUtils.getBitbarRows({
    threads,
    coinValues,
    prices: priceData,
    currency: appOptions.currency,
    symbols: sortedSymbols,
  });

  rows.push(bitbar.separator, bitbarUtils.getTotalWalletValueRow(coinValues));
  return rows;
};

const getRowsWithoutBinance = async (
  appOptions: AppOptions,
  threads: Thread[]
): Promise<BitbarRow[]> => {
  const priceData = await cryptoCompareAPI.getPrices(
    appOptions.symbols,
    appOptions.currency
  );

  return bitbarUtils.getBitbarRows({
    prices: priceData,
    symbols: appOptions.symbols,
    currency: appOptions.currency,
    threads,
  });
};
