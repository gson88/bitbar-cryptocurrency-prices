#!/usr/bin/env /usr/local/bin/node
const axios = require('axios');
const { log } = console;

//https://www.cryptocompare.com/api/#-api-data-coinlist-
const API_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD';

const run = async () => {
  try {
    const { data } = await axios.get(API_URL);
    log(data.USD);
  } catch (exception) {
    log('error');
  }
};

run();