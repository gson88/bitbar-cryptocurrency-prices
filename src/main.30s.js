#!/usr/bin/env /usr/local/bin/node

const path = require('path');
const axios = require('axios');
const bitbar = require('bitbar');
const images = require('images');
const utils = require('./utils_old');

/**
 * @param {FullPriceAPIResponse} response
 * @return {bitbar.Options[]}
 */
const getRowsFromMultiFull = async response => {
  const symbols = Object.keys(response.RAW);

  const promises = await Promise.all(
    symbols.reduce(async (acc, symbol) => {
      acc.push(bitbar.separator);
      const arr = await utils.getCryptoPriceRowFromFull(symbol, response, true);

      acc = acc.concat(arr);
      return acc;
      // return utils.getCryptoPriceRowFromFull(symbol, response[ symbol ], true);
    }, [])
  );

  const firstRow = utils.getCryptoPriceRowFromFull(
    symbols[0],
    response,
    false
  )[0];

  // const pth = path.resolve(__dirname, '../link.png');
  // const image2 = fs.readFileSync(pth);
  // const b5 = Buffer.from(image2).toString('base64');

  /** @type {bitbar.Options[]} */
  const rows = [
    {
      text: firstRow.text,
      dropdown: false,
    },
    bitbar.separator,
    // {
    //   text: 'Testing',
    //   image: b5,
    // },
    // ...symbols.reduce((acc, symbol) => {
    //   acc.push(bitbar.separator);
    //   const arr = utils.getCryptoPriceRowFromFull(symbol, response, true);
    //
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
  rows.push(utils.getOptionsMenu());
  return rows;
};

const run = async () => {
  const options = utils.getOptions();
  const img = images(path.resolve(__dirname, '../link.png'));
  const base64Img = img
    .resize(24, 24)
    .encode('png')
    .toString('base64');
  // const image2 = fs.readFileSync('./link.png');
  // const b5 = Buffer.from(image2).toString('base64');

  try {
    const { data } = await axios.get(utils.getPriceFullUrl(options));
    const rows = await getRowsFromMultiFull(data);
    bitbar(
      [
        {
          image: base64Img,
          text: 'Hello',
        },
      ].concat(rows)
    );
  } catch (exception) {
    const msg = exception && exception.message ? exception.message : 'ss';
    bitbar(['Error', msg, JSON.stringify(exception, null, 2)], {
      color: 'red',
    });
  }
};

run();
