import CashOutFeeCalculator from './cashOutFeeCalculator';
import { config } from '../../../../appConfig';

export default class CashOutFeeJuridicalCalculator extends CashOutFeeCalculator {
  constructor() {
    super();
    this.currencyFormatter = config.currencyFormatter;
    this.feeConfig = config.cashOutJuridicalFeeConfig;
  }

  calculate(operation) {
    let fee = this.currencyFormatter.format(
      (operation.operation.amount * this.feeConfig?.percents) / 100,
    );
    fee = fee < this.feeConfig?.min.amount ? this.feeConfig?.min.amount : fee;
    return fee;
  }
}
