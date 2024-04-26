import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./components/CurrencyRow";

const BASE_URL =  "http://api.exchangeratesapi.io/latest?access_key=";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount: number, fromAmount: number;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  const handleSwap = () => {
    const temp:number[] = [toAmount, fromAmount]
    console.log(temp)
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    toAmount = temp[1]
    fromAmount = temp[0]
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      })
      .catch(err => err?.error?.code === 101 && alert("Please add your access token key"));
  }, []);

  useEffect(() => {
    if (fromCurrency != "" && toCurrency != "") {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]))
        .catch(_ => {alert("This currency can't converter"); window.location.reload()});
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setAmount(Number(e.target.value));
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setAmount(Number(e.target.value));
    setAmountInFromCurrency(false);
  }

  return (
    <div className="app">
      <h1>Currency converter</h1>
      {currencyOptions.length > 0 && <span style={{marginBottom: "5px"}}>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>}
      <div className="card">
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <button className="btn-swap" onClick={handleSwap}>
          {" "}
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios-filled/50/swap.png"
            alt="swap"
          />
        </button>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={Number(toAmount.toFixed(4))}
        />
      </div>
    </div>
  );
}

export default App;
