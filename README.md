A bitbar plugin to monitor cryptocurrency prices via cryptocompare.com:s API

## Make file runnable

chmod +x dist/main.2m.js

## For binance support

Copy .env.example to .env
Put your Binance API key and secret in newly created .env-file,
fields: `BINANCE_API_KEY` and `BINANCE_SECRET`

Create Binance API key:
https://www.binance.com/en/my/settings/api-management

## Create symlink to file in your plugins folder.

ln -s ~/Documents/Projects/bitbar-cryptocurrency-prices/dist
ln -s {path-to-bitbar-repo}/dist

ln -s dist/index.js {path-to-bitbar}/plugins/bitbar-cryptocurrency-prices.30s.js
ln -s dist/index.js ~/bitbar-scripts/plugins/cryptocurrency-prices.2m.js
ln -s dist/main.2m.js ~/bitbar-scripts/plugins/cryptocurrency-prices.2m.js
