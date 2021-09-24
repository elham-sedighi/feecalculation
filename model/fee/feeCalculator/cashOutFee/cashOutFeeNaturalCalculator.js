import CashOutFeeCalculator from './cashOutFeeCalculator';
import { config } from '../../../../appConfig';

export default class CashOutFeeNaturalCalculator extends CashOutFeeCalculator {
  constructor() {
    super();
    this.currencyFormatter = config.currencyFormatter;
    this.cashOutNaturalOperationRecords = new Map();
    this.feeConfig = config.cashOutNaturalFeeConfig;
  }

  calculate(operation) {
    const existedAmount = this.getExistedAmount(operation.user_id, operation.weekNumber);
    const newAmount = operation.operation.amount;
    let fee = 0;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts >= this.feeConfig?.week_limit?.amount) {
      const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
      fee = this.currencyFormatter.format(effectiveAmount
          * this.feeConfig?.percents * 0.01);
    }
    this.addOprToMap(operation);
    return fee;
  }

  getExistedAmount(userId, weekNumber) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(userId);
    if (!oldRecord) {
      return 0;
    }
    if (oldRecord.weekNumber === weekNumber) {
      return oldRecord.amount;
    }
    return 0;
  }

  calculateExceededAmount(existedAmount) {
    if (existedAmount - this.feeConfig?.week_limit.amount > 0) {
      return 0;
    }
    return this.feeConfig?.week_limit.amount - existedAmount;
  }

  addOprToMap(operation) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(operation.user_id);
    const { weekNumber } = operation;
    if (!oldRecord) {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        { weekNumber, amount: operation.operation.amount });
    } else if (oldRecord.weekNumber === weekNumber) {
      oldRecord.amount += operation.operation.amount;
    } else {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        { weekNumber, amount: operation.operation.amount });
    }
  }
}
