#!/usr/bin/env /usr/local/bin/node
import './prestart';
import bitbar from 'bitbar';
import * as app from './app';
import * as bitbarUtils from './bitbar/utils';

const run = async () => {
  let rows = await app.getRows();
  rows = bitbarUtils.addOptionsMenu(rows);
  bitbar(rows);
};

(async () => {
  try {
    await run();
  } catch (exception) {
    const errorRows = bitbarUtils.getErrorRows(exception);
    bitbar(errorRows, {
      color: 'red',
    });
  }
})();
