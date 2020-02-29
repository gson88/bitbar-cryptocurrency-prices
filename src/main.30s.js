#!/usr/bin/env /usr/local/bin/node

const axios = require('axios');
const bitbar = require('bitbar');
const utils = require('./utils');

const getOptionsMenu = () => {
  return {
    text: 'Options',
    submenu: [
      {
        text: 'Edit symbols',
        bash: 'vim',
        param1: utils.optionsPath,
      },
    ],
  };
};

/** @param {CryptoPriceResponse} response */
const print = response => {
  const symbols = Object.keys(response);

  /** @type {bitbar.Options[]} */
  const rows = [
    {
      text: utils.getCryptoPriceRow(symbols[0], response[symbols[0]]),
      dropdown: false,
    },
    bitbar.separator,
    ...symbols.map(symbol => ({
      text: utils.getCryptoPriceRow(symbol, response[symbol]),
      href: utils.getGraphUrl(symbol, 'USD'),
    })),
  ];

  rows.push(getOptionsMenu());

  bitbar(rows);
};

const run = async () => {
  const options = utils.getOptions();

  try {
    const { data } = await axios.get(utils.getApiUrl(options));
    print(data);
  } catch (exception) {
    console.error(exception.message);
  }
};

run();
