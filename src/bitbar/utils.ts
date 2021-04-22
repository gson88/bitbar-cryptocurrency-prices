import bitbar, { BitbarOptions, Options } from 'bitbar';
import he from 'he';
import type { Thread } from '../types/4chan.types';
import type { BitbarRow, FullPriceAPIResponse } from '../types/api.types';
import type { CoinValue, UserCoinValues } from '../types/binance.types';
import * as chanAPI from '../4chan/api';
import * as options from '../options/options';

const headerSize = 12;
const smallerSize = 10;

const getSymbolValueSubmenu = (
  userCoinValue: CoinValue | undefined
): (BitbarOptions | Options)[] | undefined => {
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
  threads: Thread[],
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

  const rows: (BitbarOptions | Options)[] = [
    {
      text: `${symbol}: ${DISPLAYPRICE.replace(' ', '')}`,
      color: 'white',
      size: headerSize,
      ...(symbolValueSubmenu && {
        submenu: symbolValueSubmenu,
      }),
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
  ];

  const threadsSubmenu = get4chanThreadsSubmenu(threads, symbol);

  if (threadsSubmenu) {
    rows.push(threadsSubmenu);
  }

  return rows;
};

const get4chanThreadsSubmenu = (
  threads: Thread[],
  symbol: string
): Options | null => {
  const interestingThreads: Thread[] = chanAPI.getThreadsThatInclude(
    threads,
    symbol
  );

  if (interestingThreads.length === 0) {
    return null;
  }

  const quote = /<span class="quote">(.+)<\/span>/g;

  const submenu = interestingThreads
    .map<Options[]>((thread) => {
      const threadHref = `https://boards.4channel.org/biz/thread/${thread.no}`;
      const commentRows =
        thread.com
          ?.split('<br>')
          .filter(Boolean)
          .map((row) => he.decode(row).replace(quote, '$1')) || [];

      const title = thread.sub
        ? he.decode(thread.sub)
        : commentRows[0] || '(No title and message)';

      const threadRows: Options[] = [
        {
          text: title.concat(` (${thread.replies})`),
          length: 100,
          size: headerSize,
          href: threadHref,
        },
      ];

      return threadRows.concat(
        commentRows.slice(0, 3).map((row) => ({
          text: row,
          length: 100,
          size: smallerSize,
        }))
      );
    })
    .reduce((acc, curr) => {
      return acc.concat(bitbar.separator as any, curr);
    }, []);

  return {
    text: `Threads (${interestingThreads.length})`,
    size: smallerSize,
    color: 'gray',
    submenu,
  };
};

export const getBitbarRows = async (params: {
  prices: FullPriceAPIResponse;
  symbols: string[];
  currency: string;
  coinValues?: UserCoinValues;
  threads: Thread[];
}): Promise<BitbarRow[]> => {
  let rows: BitbarRow[] = [];

  for (let symbol of params.symbols) {
    const row = await getSymbolRows(
      symbol,
      params.currency,
      params.prices,
      params.threads,
      params.coinValues
    );

    rows = rows.concat(bitbar.separator, row);
  }

  // Remove submenu from first row
  const { submenu, ...firstRow } = rows[1] as Options;
  return [firstRow, ...rows];
};

export const addOptionsMenu = (rows: BitbarRow[]) => {
  return rows.concat([getOptionsMenu(options.optionsPath)]);
};

export const getTotalWalletValueRow = (coinValues: UserCoinValues): Options => {
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
