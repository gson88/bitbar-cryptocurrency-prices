// const GRAPH_URL =
//   'https://www.cryptocompare.com/coins/$symbolName/overview/$symbolCurrency';
// const IMAGE_URL = 'https://www.cryptocompare.com$imageUrl';
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

import axios from 'axios';

const API_PRICEMULTI_URL =
  'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=$symbolNames&tsyms=$currencies';

export const getPrices = async (symbols: string[], currency: string) => {
  const url = getPriceMultiUrl(symbols, currency);
  const { data } = await axios.get(url);
  return data;
};

const getPriceMultiUrl = (symbols: string[], currency: string): string => {
  return API_PRICEMULTI_URL.replace('$symbolNames', symbols.join(',')).replace(
    '$currencies',
    currency
  );
};
