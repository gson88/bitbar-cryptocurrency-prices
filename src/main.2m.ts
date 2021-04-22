#!/usr/bin/env /usr/local/bin/node

//   <xbar.title>Xbar Cryptocurrency Prices</xbar.title>
//   <xbar.version>1.0.0</xbar.version>
//   <xbar.author>Gson</xbar.author>
//   <xbar.author.github>gson88</xbar.author.github>
//   <xbar.desc>Fetch current prices of given crypto currencies. Integrate with Binance and see your total wallet value</xbar.desc>
//   <xbar.dependencies>node</xbar.dependencies>
//   <xbar.abouturl>https://github.com/gson88/bitbar-cryptocurrency-prices</xbar.abouturl>
//   <xbar.var>string(VAR_BINANCE_API_KEY=""): Binance API Key.</xbar.var>
//   <xbar.var>string(VAR_BINANCE_SECRET=""): Binance Secret.</xbar.var>

import dotenv from 'dotenv';
dotenv.config();

import bitbar from 'bitbar';
import * as app from './app';
import * as bitbarUtils from './bitbar/utils';

(async () => {
  try {
    let rows = await app.getCryptoRows();
    rows = bitbarUtils.addOptionsMenu(rows);
    bitbar(rows);
  } catch (exception) {
    const errorRows = bitbarUtils.getErrorRows(exception);
    bitbar(errorRows, {
      color: 'red',
    });
  }
})();
