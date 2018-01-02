#!/usr/bin/env /usr/local/bin/node

const axios = require('axios');
const symbols = require('./symbols');
const { log, error } = console;
const allSymbols = symbols.map(symbol => symbol.name);
const allPrices = symbols.map(symbol => symbol.price).reduce((prices, price) => {
  if (prices.indexOf(price) === -1) {
    prices.push(price);
  }
  return prices;
}, []);

//https://www.cryptocompare.com/api/#-api-data-coinlist-
const API_URL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${allSymbols.join(',')}&tsyms=${allPrices.join(',')}`;

const displayData = (data) => {
  let first = true;
  for (let symbol of symbols) {
    log(`${symbol.name}: $${data[symbol.name][symbol.price]}`);
    if (first) {
      log('---');
      first = false;
    }
  }
};

const run = async () => {
  try {
    const { data } = await axios.get(API_URL);
    displayData(data);
  } catch (exception) {
    error(exception);
  }
};


run();