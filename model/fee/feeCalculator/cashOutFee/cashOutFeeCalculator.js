export default class CashOutFeeCalculator {
  constructor(currencyFormatter, feeConfig) {
    this.currencyFormatter = currencyFormatter;
    this.feeConfig = feeConfig;
  }
}
