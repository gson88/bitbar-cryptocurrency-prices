import bitbar from 'bitbar';
import type { BitbarRow, FullPriceAPIResponse } from './types/api.types';

export const getOptionsMenu = (optionsPath: string): bitbar.Options => ({
  text: 'Edit symbols',
  bash: 'vim',
  param1: optionsPath,
});

const getSymbolRows = (
  symbol: string,
  currency: string,
  response: FullPriceAPIResponse
): BitbarRow[] => {
  const {
    CHANGEPCTHOUR: RAW_CHANGEPCTHOUR,
    CHANGEPCT24HOUR: RAW_CHANGEPCT24HOUR,
    // LOW24HOUR: RAW_LOW24HOUR,
    // HIGH24HOUR: RAW_HIGH24HOUR,
    // PRICE: RAWPRICE,
  } = response.RAW[symbol][currency];
  const {
    CHANGEPCTHOUR,
    CHANGEPCT24HOUR,
    // HIGH24HOUR,
    // LOW24HOUR,
    PRICE: DISPLAYPRICE,
  } = response.DISPLAY[symbol][currency];

  // const img = await images(raw.IMAGEURL);
  // const base64Img = img
  //   .resize(24, 24)
  //   .encode('png')
  //   .toString('base64');
  //
  // const topRow: BitbarRow = {
  //   text: `${symbol}: ${DISPLAYPRICE.replace(' ', '')}`,
  //   color: 'white',
  //   size: 12,
  // };

  const headerSize = 12;
  const smallerSize = 10;

  return [
    {
      text: `${symbol}: ${DISPLAYPRICE.replace(' ', '')}`,
      color: 'white',
      size: headerSize,
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

export const getRowsFromResponse = async (
  response: FullPriceAPIResponse,
  symbols: string[],
  currency: string
): Promise<BitbarRow[]> => {
  const rows = symbols.reduce<BitbarRow[]>((acc, symbol: string) => {
    acc.push(bitbar.separator);
    return acc.concat(getSymbolRows(symbol, currency, response));
  }, []);

  return [rows[1], bitbar.separator, ...rows];
};
