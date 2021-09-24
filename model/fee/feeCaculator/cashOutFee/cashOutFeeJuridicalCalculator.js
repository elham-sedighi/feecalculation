import CashOutFeeCalculator from './cashOutFeeCalculator';

export default class CashOutFeeJuridicalCalculator extends CashOutFeeCalculator {
  constructor() {
    super();
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    this.feeConfig = global.feeConfigs.get('cash_out_juridical');
  }

  calculate(operation) {
    let fee = this.currencyFormatter.format(
      (operation.operation.amount * this.feeConfig?.percents) / 100,
    );
    fee = fee < this.feeConfig?.min.amount ? this.feeConfig?.min.amount : fee;
    return fee;
  }
}
