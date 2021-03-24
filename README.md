A bitbar plugin to monitor cryptocurrency prices via cryptocompare.com:s API with Binance integration

## Build

`yarn build`

## Watch

`yarn watch`

## For binance support

Copy .env.example to .env
Put your Binance API key and secret in newly created .env-file,
fields: `BINANCE_API_KEY` and `BINANCE_SECRET`

Create Binance API key:  
https://www.binance.com/en/my/settings/api-management

## You have to make the built JS file runnable

`chmod +x dist/main.2m.js`

## Create symlink to file in your plugins folder.

`cd {bitbar plugins folder}`  
`ln -s {project folder}/dist`

or

`cd {project folder}`
`ln -s dist/main.2m.js {bitbar plugins folder}/bitbar-cryptocurrency-prices.2m.js`
