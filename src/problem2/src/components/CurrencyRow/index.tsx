import React, { FC } from "react";
import './style.css'

interface IProps {
  currencyOptions: string[];
  selectedCurrency: string;
  onChangeCurrency: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onChangeAmount: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  amount: number;
  customClass?: string;
}

const CurrencyRow: FC<IProps> = ({
  currencyOptions,
  selectedCurrency,
  onChangeCurrency,
  onChangeAmount,
  amount,
  customClass,
}) => (
  <div className={`input-select-wrapper ${customClass}`}>
    <input
      type="number"
      className="input"
      value={amount}
      onChange={onChangeAmount}
    />
    <select value={selectedCurrency} onChange={onChangeCurrency} className="select-wrap">
      {currencyOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default CurrencyRow;
