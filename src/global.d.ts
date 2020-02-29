interface Options {
  symbols: string[];
}

interface CryptoPrice {
  [k: string]: string;
}

interface CryptoPriceResponse {
  [k: string]: CryptoPrice;
}
