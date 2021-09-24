export default class CashInFeeCalculator {
  constructor(currencyFormatter, feeConfig) {
    this.currencyFormatter = currencyFormatter;
    this.feeConfig = feeConfig;
  }

  calculate(operation) {
    let fee = parseFloat(this.currencyFormatter
      .format((operation.operation.amount * this.feeConfig?.percents) / 100));
    fee = fee > parseFloat(this.feeConfig?.max.amount)
      ? parseFloat(this.feeConfig?.max.amount) : fee;
    return fee;
  }
}
