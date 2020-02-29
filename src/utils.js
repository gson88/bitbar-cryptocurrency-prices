const fs = require('fs');
const path = require('path');
const defaultOptions = require('./default-options.json');
const optionsPath = path.resolve(__dirname, '..', 'options/options.json');

//https://www.cryptocompare.com/api/#-api-data-coinlist-
const API_URL =
  'https://min-api.cryptocompare.com/data/pricemulti?fsyms=$symbolNames&tsyms=$currencies';
const GRAPH_URL =
  'https://www.cryptocompare.com/coins/$symbolName/overview/$symbolCurrency';

const getGraphUrl = (symbolName, currency) => {
  return GRAPH_URL.replace('$symbolName', symbolName)
    .replace('$symbolCurrency', currency)
    .toLowerCase();
};

/**
 * @return {Options}
 */
const getOptions = () => {
  if (fs.existsSync(optionsPath)) {
    return require(optionsPath);
  } else {
    fs.writeFileSync(optionsPath, JSON.stringify(defaultOptions, null, 2));
    return defaultOptions;
  }
};

/**
 * @param {Options} options
 * @return {string}
 */
const getApiUrl = options => {
  return API_URL.replace('$symbolNames', options.symbols.join(',')).replace(
    '$currencies',
    'USD'
  );
};

/**
 * @param {string} symbol
 * @param {CryptoPrice} row
 * @return {string}
 */
const getCryptoPriceRow = (symbol, row) => {
  return `${symbol}: $${row['USD']}`;
};

/**
 * @param {CryptoPriceResponse} response
 * @return {string[]}
 */
const getCryptoPriceRows = response => {
  return Object.entries(response).map(([symbol, priceRow], index) => {
    return getCryptoPriceRow(symbol, priceRow);
  });
};

module.exports = {
  optionsPath,
  getOptions,
  getApiUrl,
  getGraphUrl,
  getCryptoPriceRow,
  getCryptoPriceRows,
};
