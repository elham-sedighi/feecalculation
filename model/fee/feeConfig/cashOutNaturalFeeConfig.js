const OperationDetail = require('../../operationDetail');
const FeeConfig = require('./feeConfig');

export default class cashOutNaturalFeeConfig extends FeeConfig {
  constructor(percents, weekLimit) {
    super(percents);
    this.week_limit = new OperationDetail(weekLimit.amount, weekLimit.currency);
  }
}
