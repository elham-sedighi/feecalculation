import CashOutFeeCalculator from './cashOutFeeCalculator';

export default class CashOutFeeJuridicalCalculator extends CashOutFeeCalculator {
  calculate(operation) {
    let fee = this.currencyFormatter.format(
      (operation.operation.amount * this.feeConfig?.percents) / 100,
    );
    fee = fee < this.feeConfig?.min.amount ? this.feeConfig?.min.amount : fee;
    return fee;
  }
}
