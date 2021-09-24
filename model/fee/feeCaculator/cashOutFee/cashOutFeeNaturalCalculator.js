import * as CashOutFeeCalculator from './cashOutFeeCalculator';

export default class CashOutFeeNaturalCalculator {
  constructor() {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      /* style: 'currency', */
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    this.cashOutNaturalOperationRecords = new Map();
    this.feeConfig = global.feeConfigs.get('cash_out_natural');
  }

  calculate(operation) {
    const existedAmount = this.getExistedAmount(operation.user_id, operation.date);
    const newAmount = operation.operation.amount;
    let fee;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts > this.feeConfig?.week_limit?.amount) {
      const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
      fee = parseFloat(this.currencyFormatter.format(effectiveAmount
          * this.feeConfig?.percents * 0.01)).toFixed(2);
    }
    this.addOprToMap(operation);
    return fee;
  }

  getExistedAmount(userId, date) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(userId);
    if (!oldRecord) {
      return 0;
    }
    if (oldRecord.date === date) {
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
    const oprDate = operation.date;
    if (!oldRecord) {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        { date: oprDate, amount: operation.operation.amount });
    } else if (oldRecord.date === oprDate) {
      oldRecord.amount += operation.operation.amount;
    } else {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        { date: oprDate, amount: operation.operation.amount });
    }
  }
}
