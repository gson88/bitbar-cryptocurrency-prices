#!/usr/bin/env /usr/local/bin/node
import path from 'path';
import axios from 'axios';
import bitbar, { Options } from 'bitbar';
import images from 'images';
import type { BitbarRow } from './crypto-types';
import {
  mapResponseToRows,
  getOptions,
  getOptionsMenu,
  getPriceFullUrl,
} from './utils';

const getRowsFromMultiFull = async (response): Promise<BitbarRow[]> => {
  const symbols = Object.keys(response.RAW);

  const promises = symbols.reduce<BitbarRow[]>((acc, symbol: string) => {
    acc.push(bitbar.separator);
    const rows = mapResponseToRows(symbol, response, true);

    acc = acc.concat(rows);
    return acc;
  }, []);

  const firstRow = mapResponseToRows(symbols[0], response, false)[0] as Options;

  const rows: BitbarRow[] = [
    {
      text: firstRow.text,
      dropdown: false,
    },
    bitbar.separator,
    ...promises
    // {
    //   text: 'Testing',
    //   image: b5,
    // },
    // ...symbols.reduce((acc, symbol) => {
    //   // @ts-ignore
    //   acc.push(bitbar.separator);
    //   const arr = await mapResponseToRows(symbol, response, true);
    //
    //   // @ts-ignore
    //   acc = acc.concat(arr);
    //   return acc;
    //   // return utils.getCryptoPriceRowFromFull(symbol, response[ symbol ], true);
    // }, []),
    // ...symbols.map(symbol => ({
    //   text: utils.getCryptoPriceRowFromFull(symbol, response[symbol]),
    //   href: utils.getGraphUrl(symbol, 'USD'),
    // })),
  ];
  // console.log( ...symbols.map(symbol =>
  //   utils.getCryptoPriceRowFromFull(symbol, response[symbol])
  // ),);

  rows.push(bitbar.separator);
  rows.push(getOptionsMenu());
  return rows;
};

const run = async () => {
  const options = getOptions();
  const img = images(path.resolve(__dirname, '../link.png'));
  const base64Img = img.resize(24, 24).encode('png').toString('base64');
  // const image2 = fs.readFileSync('./link.png');
  // const b5 = Buffer.from(image2).toString('base64');

  try {
    const { data } = await axios.get(getPriceFullUrl(options));
    const rows = await getRowsFromMultiFull(data);
    bitbar(
      // @ts-ignore
      rows
      // [
      //   {
      //     image: base64Img,
      //     text: 'Hello',
      //   },
      //   // @ts-ignore
      // ].concat(rows)
    );
  } catch (exception) {
    const msg = exception && exception.message ? exception.message : 'ss';
    bitbar(['Error', msg, exception], {
      color: 'red',
    });
  }
};

run();
