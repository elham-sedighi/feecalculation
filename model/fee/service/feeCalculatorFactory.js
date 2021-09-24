import CashInFeeCalculator from '../feeCalculator/cashInFeeCalculator';
import CashOutFeeNaturalCalculator from '../feeCalculator/cashOutFee/cashOutFeeNaturalCalculator';
import CashOutFeeJuridicalCalculator from '../feeCalculator/cashOutFee/cashOutFeeJuridicalCalculator';
import { config } from '../../../appConfig';

export default class FeeCalculatorFactory {
  constructor() {
    this.feeCalculators = new Map();
  }

  getFeeCalculatorInstance(usertype, operationType) {
    let feeCalculator;
    switch (operationType) {
      case 'cash_out':
        feeCalculator = this.feeCalculators.get(`${operationType}_${usertype}`);
        break;
      default:
        feeCalculator = this.feeCalculators.get(operationType);
        break;
    }
    if (feeCalculator) return feeCalculator;

    switch (operationType) {
      case 'cash_out':
        switch (usertype) {
          case 'natural':
            feeCalculator = new CashOutFeeNaturalCalculator(
              config.currencyFormatter, config.cashOutNaturalFeeConfig,
            );
            break;
          default:
            feeCalculator = new CashOutFeeJuridicalCalculator(
              config.currencyFormatter, config.cashOutJuridicalFeeConfig,
            );
        }
        this.feeCalculators.set(`${operationType}_${usertype}`, feeCalculator);
        return feeCalculator;
      default:
        feeCalculator = new CashInFeeCalculator(config.currencyFormatter, config.cashInFeeConfig);
        this.feeCalculators.set(operationType, feeCalculator);
        return feeCalculator;
    }
  }
}
