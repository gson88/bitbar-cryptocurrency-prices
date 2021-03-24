import fs from 'fs';
import path from 'path';
import defaultOptions from './json/default-options.json';
import type { AppOptions } from '../types/app.types';

export const optionsPath = path.resolve(__dirname, './json/options.json');

export const getOptions = (): AppOptions => {
  const optionsFileExists = fs.existsSync(optionsPath);
  if (!optionsFileExists) {
    fs.writeFileSync(optionsPath, JSON.stringify(defaultOptions, null, 2));
    return defaultOptions;
  }

  let writeFile = false;
  const existingOptions = require(optionsPath);
  Object.entries(defaultOptions).forEach(([field, value]) => {
    if (!existingOptions.hasOwnProperty(field)) {
      writeFile = true;
      existingOptions[field] = value;
    }
  });

  if (writeFile) {
    fs.writeFileSync(optionsPath, JSON.stringify(existingOptions, null, 2));
  }
  return existingOptions;
};
