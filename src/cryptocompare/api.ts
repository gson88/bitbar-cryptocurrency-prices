import fetch from 'node-fetch';
import type { FullPriceAPIResponse } from '../types/api.types';

const API_PRICEMULTI_URL =
  'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=$symbolNames&tsyms=$currencies';

export const getPrices = async (
  symbols: string[],
  currency: string
): Promise<FullPriceAPIResponse> => {
  const url = getPriceMultiUrl(symbols, currency);
  const response = await fetch(url);
  return response.json();
};

const getPriceMultiUrl = (symbols: string[], currency: string): string => {
  return API_PRICEMULTI_URL.replace('$symbolNames', symbols.join(',')).replace(
    '$currencies',
    currency
  );
};
