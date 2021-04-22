import fetch, { Request, Headers } from 'node-fetch';
import * as CryptoJS from 'crypto-js';
import type {
  AccountInformation,
  AccountBalance,
  FixedBalance,
  UserCoins,
} from '../types/binance.types';

const BASE_URL = 'https://api.binance.com';
const HEADER_API_KEY = 'X-MBX-APIKEY';
const API_KEY = (process.env.VAR_BINANCE_API_KEY ||
  process.env.BINANCE_API_KEY) as string;
const SECRET = (process.env.VAR_BINANCE_SECRET ||
  process.env.BINANCE_SECRET) as string;

export const hasEnvironmentKeys = () => {
  return Boolean(API_KEY && SECRET);
};

const getQueryStringWithSignature = (
  parameters: Record<string, string | number>
): string => {
  const nowTimestamp = Date.now();
  const parametersWithTimestamp = { ...parameters, timestamp: nowTimestamp };

  const queryString = Object.entries(parametersWithTimestamp)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  const signature = CryptoJS.HmacSHA256(queryString, SECRET).toString();
  return `${queryString}&signature=${signature}`;
};

const get = async (
  path: string,
  parameters: Record<string, string | number> = {}
) => {
  const headers = new Headers();
  headers.set(HEADER_API_KEY, API_KEY);

  const queryString = getQueryStringWithSignature(parameters);
  const req = new Request(`${BASE_URL}/${path}?${queryString}`, {
    headers,
  });

  return fetch(req);
};

const getAccountInformation = async (): Promise<AccountInformation> => {
  const response = await get(`api/v3/account`);
  return await response.json();
};

// export const getCoinUserTrades = async (symbol: string): Promise<Trade[]> => {
//   const response = await get(`api/v3/allOrders`, {
//     symbol,
//     limit: 500,
//   });
//   return await response.json();
// };

const getUserBalances = (
  allBalances: AccountBalance[],
  minAmountOfCoins = 0
): UserCoins => {
  const userBalance = allBalances
    .map<FixedBalance>((balance) => ({
      asset: balance.asset,
      free: Number(balance.free),
      locked: Number(balance.locked),
    }))
    .filter((userCoin) => userCoin.free + userCoin.locked > minAmountOfCoins);

  const symbols = userBalance.map((userCoin) => userCoin.asset);

  return {
    symbols,
    userBalance,
  };
};

export const getUserAccuntBalances = async (): Promise<UserCoins> => {
  const accountInformation = await getAccountInformation();
  return getUserBalances(accountInformation.balances, 0);
};
