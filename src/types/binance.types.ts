export interface AccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: AccountBalance[];
}

export interface AccountBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface FixedBalance {
  asset: string;
  free: number;
  locked: number;
}

export type CoinValue = {
  asset: string;
  value: number;
  quantity: number;
};

export type UserCoinValues = Record<string, CoinValue>;

export interface UserCoins {
  symbols: string[];
  userBalance: FixedBalance[];
}

// export interface Trade {
//   symbol: string;
//   orderId: number;
//   orderListId: number;
//   clientOrderId: string;
//   price: string;
//   origQty: string;
//   executedQty: string;
//   cummulativeQuoteQty: string;
//   status: string;
//   timeInForce: string;
//   type: string;
//   side: string;
//   stopPrice: string;
//   icebergQty: string;
//   time: number;
//   updateTime: number;
//   isWorking: boolean;
//   origQuoteOrderQty: string;
// }
//
// export interface WalletCoin {
//   coin: string;
//   depositAllEnable: boolean;
//   withdrawAllEnable: boolean;
//   name: string;
//   free: string;
//   locked: string;
//   freeze: string;
//   withdrawing: string;
//   ipoing: string;
//   ipoable: string;
//   storage: string;
//   isLegalMoney: boolean;
//   trading: boolean;
//   networkList: Network[];
// }
//
// interface Network {
//   network: string;
//   coin: string;
//   withdrawIntegerMultiple: '0.00000001';
//   isDefault: boolean;
//   depositEnable: boolean;
//   withdrawEnable: boolean;
//   depositDesc: string;
//   withdrawDesc: string;
//   specialTips: string;
//   name: string;
//   resetAddressStatus: boolean;
//   addressRegex: RegExp;
//   memoRegex: string;
//   withdrawFee: string;
//   withdrawMin: string;
//   withdrawMax: string;
//   minConfirm: number;
//   unLockConfirm: number;
// }
