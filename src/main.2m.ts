#!/usr/bin/env /usr/local/bin/node
import bitbar from 'bitbar';
import * as api from './api';
import * as utils from './utils';
import * as options from './options';

const run = async () => {
  const { symbols, currency } = options.getOptions();

  const resp = await api.getPrices(symbols, currency);
  const rows = await utils.getRowsFromResponse(resp, symbols, currency);

  const allRows = rows.concat([
    bitbar.separator,
    utils.getOptionsMenu(options.optionsPath),
  ]);
  bitbar(allRows);
};

(async () => {
  try {
    await run();
  } catch (exception) {
    const msg = exception.message || 'No message';
    bitbar(['Error', msg, exception], {
      color: 'red',
    });
  }
})();
