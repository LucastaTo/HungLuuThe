export interface CurrencyState {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  priceData: { [key: string]: number };
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
  setAmount: (amount: number) => void;
  setPriceData: (data: { [key: string]: number }) => void;
  fetchPriceData: () => void;
}
