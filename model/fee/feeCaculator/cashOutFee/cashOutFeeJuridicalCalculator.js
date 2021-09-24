import * as CashOutFeeCalculator from './cashOutFeeCalculator';

export default class CashOutFeeJuridicalCalculator {
  constructor() {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      /* style: 'currency', */
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    this.feeConfig = global.feeConfigs.get('cash_out_juridical');
  }

  calculate(operation) {
    let fee = parseFloat(this.currencyFormatter.format(
      (operation.operation.amount * this.feeConfig?.percents) / 100,
    )).toFixed(2);
    fee = fee < this.feeConfig?.min.amount
      ? this.feeConfig?.min.amount : fee;
    return fee;
  }
}
