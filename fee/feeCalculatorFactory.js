import CashInFeeCalculator from './feeCalculator/cashInFeeCalculator';
import CashOutFeeNaturalCalculator from './feeCalculator/cashOutFee/cashOutFeeNaturalCalculator';
import CashOutFeeJuridicalCalculator from './feeCalculator/cashOutFee/cashOutFeeJuridicalCalculator';
import { config } from '../appConfig/appConfig';
import { UserType } from '../model/userType';
import { OperationType } from '../model/operationType';

// a factory to create new calculator for each operation (operation type/user type)
export default class FeeCalculatorFactory {
  constructor() {
    this.feeCalculators = new Map();
  }

  getFeeCalculatorInstance(usertype, operationType) {
    let feeCalculator;
    switch (operationType) {
      case OperationType.cash_out:
        feeCalculator = this.feeCalculators.get(`${operationType}_${usertype}`);
        break;
      default:
        feeCalculator = this.feeCalculators.get(operationType);
        break;
    }
    if (feeCalculator) return feeCalculator;

    switch (operationType) {
      case OperationType.cash_out:
        switch (usertype) {
          case UserType.natural:
            feeCalculator = new CashOutFeeNaturalCalculator(config.cashOutNaturalFeeConfig);
            break;
          default:
            feeCalculator = new CashOutFeeJuridicalCalculator(config.cashOutJuridicalFeeConfig);
        }
        this.feeCalculators.set(`${operationType}_${usertype}`, feeCalculator);
        return feeCalculator;
      default:
        feeCalculator = new CashInFeeCalculator(config.cashInFeeConfig);
        this.feeCalculators.set(operationType, feeCalculator);
        return feeCalculator;
    }
  }
}
