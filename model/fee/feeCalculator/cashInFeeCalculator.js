import { config } from '../../../appConfig';

export default class CashInFeeCalculator {
  constructor() {
    this.currencyFormatter = config.currencyFormatter;
    this.feeConfig = config.cashInFeeConfig;
  }

  calculate(operation) {
    let fee = parseFloat(this.currencyFormatter
      .format((operation.operation.amount * this.feeConfig?.percents) / 100));
    fee = fee > parseFloat(this.feeConfig?.max.amount)
      ? parseFloat(this.feeConfig?.max.amount) : fee;
    return fee;
  }
}
