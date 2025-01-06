import { create } from "zustand";
import axios from "axios";

// Type Imports
import type { CurrencyState } from "./currenciestype";

export const useCurrencyStore = create<CurrencyState>((set) => ({
  fromCurrency: "USD",
  toCurrency: "BUSD",
  amount: 1,
  priceData: {},

  setFromCurrency: (currency: string) =>
    set(() => ({ fromCurrency: currency })),

  setToCurrency: (currency: string) => set(() => ({ toCurrency: currency })),

  setAmount: (amount: number) => set(() => ({ amount })),

  setPriceData: (data: Record<string, number>) =>
    set(() => ({ priceData: data })),

  fetchPriceData: async () => {
    try {
      const response = await axios.get(
        "https://interview.switcheo.com/prices.json"
      );

      if (response?.data) {
        const priceData = response.data.reduce(
          (
            acc: { [key: string]: number },
            item: { currency: string; price: number }
          ) => {
            if (item.currency && item.price) {
              acc[item.currency] = item.price;
            }
            return acc;
          },
          {}
        );

        set({ priceData });
      }
    } catch (error) {
      console.error("Failed to fetch price data", error);
    }
  },
}));
