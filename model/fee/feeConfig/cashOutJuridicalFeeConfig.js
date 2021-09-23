const FeeConfig = require('./feeConfig');
const OperationDetail = require('../../operationDetail');

export default class cashOutJuridicalFeeConfig extends FeeConfig {
  constructor(percents, min) {
    super(percents);
    this.min = new OperationDetail(min.amount, min.currency);
  }
}
