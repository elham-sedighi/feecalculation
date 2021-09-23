const fetch = require('node-fetch');
const CashOutFeeCalculator = require('./cashOutFeeCalculator');
const appConfig = require('../../../../appConfig');

class CashOutFeeNaturalCalculator extends CashOutFeeCalculator {
  constructor() {
    super();
    this.cashOutNaturalOperationRecords = new Map();
    fetch(appConfig.cashOutNaturalFeeConfigURL).then((_config) => {
      this.feeConfig = _config;
    });
  }

  calculate(operation) {
    const existedAmount = this.getExistedAmount(operation.user_id, operation.date);
    const newAmount = operation.operation.amount;
    let fee;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts > this.feeConfig?.week_limit.amount) {
      const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
      fee = parseFloat(appConfig.currencyFormatter.format(effectiveAmount
              * this.feeConfig?.percents * 0.01));
    }
    this.addOprToMap(operation);
    return fee;
  }

  getExistedAmount(userId, date) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(userId);
    if (!oldRecord) {
      return 0;
    }
    if (oldRecord.date.week() === date.week()) {
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
    } else if (oldRecord.date.week() === oprDate.week()) {
      oldRecord.amount += operation.operation.amount;
    } else {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        { date: oprDate, amount: operation.operation.amount });
    }
  }
}

module.exports = CashOutFeeNaturalCalculator;
