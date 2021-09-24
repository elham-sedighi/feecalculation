export default class CashInFeeCalculator {
  constructor() {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    this.feeConfig = global.feeConfigs.get('cash_in');
  }

  calculate(operation) {
    let fee = parseFloat(this.currencyFormatter
      .format((operation.operation.amount * this.feeConfig?.percents) / 100));
    fee = fee > parseFloat(this.feeConfig?.max.amount) ? parseFloat(this.feeConfig?.max.amount) : fee;
    return fee;
  }
}
