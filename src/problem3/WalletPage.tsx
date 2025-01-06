interface WalletBalance {
  currency: string;
  amount: number;
}

interface BlockchainWalletBalance extends WalletBalance {
  blockchain: string;
}

interface FormattedWalletBalance extends BlockchainWalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    const priorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorities[blockchain] ?? -99;
  };

  const filteredBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.currency);
      return balancePriority > -99 && balance.amount > 0;
    });
  }, [balances]);

  const sortedBalances = useMemo(() => {
    return [...filteredBalances].sort(
      (lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.currency);
        const rightPriority = getPriority(rhs.currency);
        return rightPriority - leftPriority;
      }
    );
  }, [filteredBalances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map(
      (balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        blockchain: "",
        formatted: new Intl.NumberFormat().format(balance.amount),
      })
    );
  }, [sortedBalances]);

  const usdValues = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => ({
      ...balance,
      usdValue: prices[balance.currency] * balance.amount,
    }));
  }, [formattedBalances, prices]);

  const rows = usdValues.map((balance: FormattedWalletBalance) => (
    <WalletRow
      className={classes.row}
      key={balance.currency}
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  ));

  return <div {...rest}>{rows}</div>;
};
