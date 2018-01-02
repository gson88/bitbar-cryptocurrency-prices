#!/usr/bin/env /usr/local/bin/node

const axios = require('axios');
const symbols = require('./symbols');
const { log } = console;

//https://www.cryptocompare.com/api/#-api-data-coinlist-
const API_URL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD`;

const displayData = (data) => {
  let first = true;
  for (let symbol of symbols) {
    if (!first) {
      log('---');
    }
    log(`$${data[symbol].USD}`);
    first = false;
  }
};

const run = async () => {
  try {
    const { data } = await axios.get(API_URL);
    displayData(data);
  } catch (exception) {
    log('error');
  }
};

run();