export default class CashInFeeCalculator {
  constructor() {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    this.feeConfig = global.feeConfigs.get('cash_in');
  }

  calculate(operation) {
    let fee = parseFloat(
      this.currencyFormatter.format((operation.operation.amount * this.feeConfig?.percents) / 100),
    ).toFixed(2);
    fee = fee > this.feeConfig?.max.amount ? this.feeConfig?.max.amount : fee;
    return fee;
  }
}
