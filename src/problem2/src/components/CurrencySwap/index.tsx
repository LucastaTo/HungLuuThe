import React, { useState, useEffect } from "react";

// Store Imports
import { useCurrencyStore } from "@stores/Currencies/currencies";

// Component Imports
import SearchableSelect from "@components/SearchableSelect";

// Style Imports
import "./styles.css";

const loadIconThrottle = (currency: string) => {
  const iconMapCache: Record<string, string> = {};
  if (iconMapCache[currency]) {
    return iconMapCache[currency];
  }

  const iconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
  iconMapCache[currency] = iconUrl;
  return iconUrl;
};

const CurrencySwap: React.FC = () => {
  const {
    fromCurrency,
    toCurrency,
    amount,
    priceData,
    setFromCurrency,
    setToCurrency,
    setAmount,
  } = useCurrencyStore();

  const exchangeRate = React.useMemo(
    () => !!priceData && priceData[toCurrency] / priceData[fromCurrency],
    [toCurrency, fromCurrency]
  );
  const [fromAmountInput, setFromAmountInput] = useState<number>(amount);
  const [toAmountInput, setToAmountInput] = useState<number>(0);

  useEffect(() => {
    !!priceData &&
      setToAmountInput(priceData[toCurrency] / priceData[fromCurrency]);
  }, [priceData, fromCurrency, toCurrency]);

  useEffect(() => {
    useCurrencyStore.getState().fetchPriceData();
  }, []);

  const currencyOptions = priceData
    ? Object.keys(priceData).map((currency) => ({
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={loadIconThrottle(currency)}
              alt={`${currency} logo`}
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            {currency}
          </div>
        ),
        value: currency,
      }))
    : [];

  const normalizeAmount = (value: string): number => {
    const normalizedValue = value.replace(/^0+(?!\d)/, "");

    const parsedValue = parseFloat(normalizedValue);

    if (isNaN(parsedValue) || parsedValue < 0) {
      return 0;
    }

    return parsedValue;
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const normalizedValue = normalizeAmount(value);
    setFromAmountInput(normalizedValue);
    setAmount(normalizedValue);
    setToAmountInput(normalizedValue * exchangeRate);
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const normalizedValue = normalizeAmount(value);
    setToAmountInput(normalizedValue);
    setAmount(normalizedValue / exchangeRate);
    setFromAmountInput(normalizedValue / exchangeRate);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);

    const tempAmount = fromAmountInput;
    setFromAmountInput(toAmountInput);
    setToAmountInput(tempAmount);

    setAmount(toAmountInput);
  };

  return (
    <>
      <h1 className="title">
        Convert and Swap {fromCurrency} to {toCurrency}
      </h1>

      <div className="currency-container">
        <div className="field-currency from-currency">
          <input
            type="number"
            value={fromAmountInput}
            onChange={handleFromAmountChange}
            className="field-currency-input"
          />
          <SearchableSelect
            value={fromCurrency}
            isClearable={false}
            onChange={setFromCurrency}
            options={currencyOptions}
          />
        </div>
        <div>
          <button onClick={handleSwap} className="btn-swap">
            <img
              width="18"
              height="18"
              src="https://img.icons8.com/ios-filled/50/swap.png"
              alt="swap"
            />
          </button>
        </div>
        <div className="field-currency to-currency">
          <input
            type="number"
            value={toAmountInput}
            onChange={handleToAmountChange}
            className="field-currency-input"
          />
          <SearchableSelect
            isClearable={false}
            value={toCurrency}
            onChange={setToCurrency}
            options={currencyOptions}
          />
        </div>
      </div>
    </>
  );
};

export default CurrencySwap;
