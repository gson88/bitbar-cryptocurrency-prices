import fs from 'fs';
import path from 'path';
import bitbar, { Options } from 'bitbar';
import images from 'images';
import type { AppOptions } from './app-types';
import type { BitbarRow, FullPriceAPIResponse } from './crypto-types';
import defaultOptions from './default-options.json';

// //https://www.cryptocompare.com/api/#-api-data-coinlist-
// const API_PRICE_MULTI_URL =
//   'https://min-api.cryptocompare.com/data/pricemulti?fsyms=$symbolNames&tsyms=$currencies';
// const GRAPH_URL =
//   'https://www.cryptocompare.com/coins/$symbolName/overview/$symbolCurrency';
// const IMAGE_URL = 'https://www.cryptocompare.com$imageUrl';

const API_PRICE_MULTI_FULL_URL =
  'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=$symbolNames&tsyms=$currencies';

const optionsPath = path.resolve(__dirname, '..', 'options/options.json');

// export const getGraphUrl = (symbol: string, currency: string): string => {
//   return GRAPH_URL.replace('$symbolName', symbol)
//     .replace('$symbolCurrency', currency)
//     .toLowerCase();
// };
// export const getImageUrl = (imagePath: string): string => {
//   return IMAGE_URL.replace('$imageUrl', imagePath).toLowerCase();
// };
// export function getPriceMultiUrl(options: AppOptions): string {
//   return API_PRICE_MULTI_URL.replace(
//     '$symbolNames',
//     options.symbols.join(',')
//   ).replace('$currencies', 'USD');
// }

export function getOptions(): AppOptions {
  if (fs.existsSync(optionsPath)) {
    return require(optionsPath);
  }

  fs.writeFileSync(optionsPath, JSON.stringify(defaultOptions, null, 2));
  return defaultOptions;
}

export function getPriceFullUrl(options: AppOptions): string {
  return API_PRICE_MULTI_FULL_URL.replace(
    '$symbolNames',
    options.symbols.join(',')
  ).replace('$currencies', 'USD');
}

// export function getCryptoPriceRow(symbol: string, row: CryptoPrice): string {
//   return `${symbol}: $${row['USD']}`;
// }

export const mapResponseToRows = (
  symbol: string,
  response: FullPriceAPIResponse,
  enableSubmenu: boolean
): BitbarRow[] => {
  const display = response.DISPLAY[symbol]['USD'];
  const raw = response.RAW[symbol]['USD'];

  // const img = await images(raw.IMAGEURL);
  // const base64Img = img
  //   .resize(24, 24)
  //   .encode('png')
  //   .toString('base64');

  const menuRows: BitbarRow[] = [
    {
      text: `${symbol}: $${raw.PRICE}`,
      color: 'white',
      size: 12,
    },
  ];

  if (enableSubmenu) {
    const { CHANGEPCTHOUR, CHANGEPCT24HOUR } = display;
    const smallerSize = 10;

    menuRows.push(
      {
        text: `1h:   ${CHANGEPCTHOUR}%`,
        color: Number(CHANGEPCTHOUR) > 0 ? 'green' : 'red',
        size: smallerSize,
      },
      {
        text: `24h: ${CHANGEPCT24HOUR}%`,
        color: Number(CHANGEPCT24HOUR) > 0 ? 'green' : 'red',
        size: smallerSize,
      }
    );
  }

  return menuRows;
}

export function getOptionsMenu(): bitbar.Options {
  return {
    text: 'Options',
    submenu: [
      {
        text: 'Edit symbols',
        bash: 'vim',
        param1: optionsPath,
      },
    ],
  };
}
