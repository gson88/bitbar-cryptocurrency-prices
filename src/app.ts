import bitbar from 'bitbar';
import type { BitbarRow } from './types/api.types';
import type { FixedBalance } from './types/binance.types';
import * as binanceAPI from './binance/api';
import * as bitbarUtils from './bitbar/utils';
import * as chanAPI from './4chan/api';
import * as cryptoCompareAPI from './cryptocompare/api';
import * as options from './options/options';
import * as utils from './utils/utils';

export const getCryptoRows = async (): Promise<BitbarRow[]> => {
  const appOptions = options.getOptions();
  const threads = await chanAPI.getCatalogThreads();

  let symbols: string[] = [];
  let userBalance: FixedBalance[] = [];

  if (binanceAPI.hasEnvironmentKeys()) {
    try {
      ({ symbols, userBalance } = await binanceAPI.getUserAccuntBalances());
    } catch (error) {
      throw new Error('Binance integration failed');
    }
  }

  symbols = utils.addSymbolsFromOptions(symbols, appOptions);

  const prices = await cryptoCompareAPI.getPrices(symbols, appOptions.currency);

  const coinValues = utils.getValuesForUserCoins(
    userBalance,
    prices,
    appOptions.currency,
    appOptions.binance.minCoinWalletValue
  );

  symbols.sort((a, b) => {
    const value1 = coinValues[a]?.value ?? 0;
    const value2 = coinValues[b]?.value ?? 0;
    return value1 > value2 ? -1 : 1;
  });

  const rows = await bitbarUtils.getBitbarRows({
    threads,
    coinValues,
    symbols,
    prices,
    currency: appOptions.currency,
  });

  rows.push(bitbar.separator, bitbarUtils.getTotalWalletValueRow(coinValues));
  return rows;
};
