import fs from 'fs';
import path from 'path';
import defaultOptions from './options/default-options.json';
import type { AppOptions } from './types/app.types';

export const optionsPath = path.resolve(__dirname, './options/options.json');

export const getOptions = (): AppOptions => {
  if (fs.existsSync(optionsPath)) {
    return require(optionsPath);
  }

  fs.writeFileSync(optionsPath, JSON.stringify(defaultOptions, null, 2));
  return defaultOptions;
};
