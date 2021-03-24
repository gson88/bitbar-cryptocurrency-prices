import bitbar, { Options } from 'bitbar';
import type { BitbarRow, FullPriceAPIResponse } from '../types/api.types';
import type { CoinValue, UserCoinValues } from '../types/binance.types';
import * as options from '../options/options';

const headerSize = 12;
const smallerSize = 10;

const getSymbolValueSubmenu = (userCoinValue: CoinValue | undefined) => {
  if (!userCoinValue) {
    return;
  }

  return [
    {
      text: `Qty: ${userCoinValue.quantity.toFixed(0)}`,
      color: 'white',
      size: smallerSize,
    },
    bitbar.separator as any,
    {
      text: `Total: $${userCoinValue.value}`,
      color: 'green',
      size: smallerSize,
    },
  ];
};

const getSymbolRows = async (
  symbol: string,
  currency: string,
  response: FullPriceAPIResponse,
  coinValues?: UserCoinValues
): Promise<BitbarRow[]> => {
  const {
    CHANGEPCTHOUR: RAW_CHANGEPCTHOUR,
    CHANGEPCT24HOUR: RAW_CHANGEPCT24HOUR,
  } = response.RAW[symbol][currency];
  const {
    CHANGEPCTHOUR,
    CHANGEPCT24HOUR,
    PRICE: DISPLAYPRICE,
  } = response.DISPLAY[symbol][currency];

  const coinValue = coinValues?.[symbol];
  const symbolValueSubmenu = getSymbolValueSubmenu(coinValue);

  return [
    {
      text: `${symbol}: ${DISPLAYPRICE.replace(' ', '')}`,
      color: 'white',
      size: headerSize,
      submenu: symbolValueSubmenu,
    },
    {
      text: `1h:   ${CHANGEPCTHOUR}%`,
      color: RAW_CHANGEPCTHOUR > 0 ? 'green' : 'red',
      size: smallerSize,
    },
    {
      text: `24h: ${CHANGEPCT24HOUR}%`,
      color: RAW_CHANGEPCT24HOUR > 0 ? 'green' : 'red',
      size: smallerSize,
    },
    // {
    //   text: `${LOW24HOUR.replace(' ', '')} - ${HIGH24HOUR.replace(' ', '')}`,
    //   // color: Number(CHANGEPCTHOUR) > 0 ? 'green' : 'red',
    //   size: smallerSize,
    // },
    // {
    //   text: `${LOW24HOUR.replace(' ', '')} (-${(
    //     RAWPRICE - RAW_LOW24HOUR
    //   ).toPrecision(2)}) - ${HIGH24HOUR.replace(' ', '')} (+${(
    //     RAW_HIGH24HOUR - RAWPRICE
    //   ).toPrecision(2)})`,
    //   // color: Number(CHANGEPCTHOUR) > 0 ? 'green' : 'red',
    //   size: smallerSize,
    // },
  ];
};

export const getBitbarRows = async (params: {
  prices: FullPriceAPIResponse;
  symbols: string[];
  currency: string;
  coinValues?: UserCoinValues;
}): Promise<BitbarRow[]> => {
  let rows: BitbarRow[] = [];

  for (let symbol of params.symbols) {
    rows.push(bitbar.separator);
    const row = await getSymbolRows(
      symbol,
      params.currency,
      params.prices,
      params.coinValues
    );
    rows = rows.concat(row);
  }

  // Remove submenu from first row
  const { submenu, ...firstRow } = rows[1] as Options;
  return [firstRow, ...rows];
};

export const addOptionsMenu = (rows: BitbarRow[]) => {
  return rows.concat([getOptionsMenu(options.optionsPath)]);
};

export const getTotalWalletValueRow = (coinValues: UserCoinValues) => {
  const totalWalletValue = Object.values(coinValues).reduce(
    (acc, coinValue) => {
      return acc + coinValue.value;
    },
    0
  );

  return {
    text: 'Total',
    submenu: [
      {
        text: `$${totalWalletValue}`,
        color: 'green',
        size: 10,
      },
    ],
  };
};

export const getOptionsMenu = (optionsPath: string): bitbar.Options => ({
  text: 'Edit symbols',
  bash: 'vim',
  param1: optionsPath,
});

export const getErrorRows = (exception: any): BitbarRow[] => {
  const msg = exception?.message || 'No message';
  const callStack = exception?.stack
    ? JSON.stringify(exception?.stack)
    : undefined;

  const messages: Options[] = [
    {
      text: 'Error',
      dropdown: false,
    },
    bitbar.separator as any,
    {
      text: msg,
    },
  ];

  if (callStack) {
    messages[messages.length - 1].submenu = callStack
      .split('\\n')
      .map((row) => ({
        text: row,
      }));
  }
  return messages;
};
