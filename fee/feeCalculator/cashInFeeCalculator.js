export default class CashInFeeCalculator {
  constructor(feeConfig) {
    this.feeConfig = feeConfig;
  }

  calculate(operation) {
    let fee = (operation.operation.amount * this.feeConfig?.percents) / 100;
    fee = fee > this.feeConfig?.max.amount
      ? this.feeConfig?.max.amount : fee;
    return fee;
  }
}
