const FeeConfig = require('./feeConfig');
const OperationDetail = require('../../operationDetail');

export default class cashInFeeConfig extends FeeConfig {
  constructor(percents, max) {
    super(percents);
    this.max = new OperationDetail(max.amount, max.currency);
  }
}
