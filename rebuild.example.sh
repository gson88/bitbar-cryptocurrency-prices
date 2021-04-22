options_file="dist/options/json/options.json"
temp_file="./options.json"
copy=0

if [ -f "${options_file}" ]
then
  cp $options_file $temp_file
  copy=1
fi

rm -rf dist
rm  ~/Library/Application\ Support/xbar/plugins/cryptocurrency-prices.2m.js
yarn build
chmod +x dist/main.2m.js
ln -s dist/main.2m.js ~/Library/Application\ Support/xbar/plugins/cryptocurrency-prices.2m.js

if [ $copy  == 1 ]
then
  mv $temp_file $options_file
fi
