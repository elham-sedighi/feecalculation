import FeeConfig from './feeConfig';
import OperationDetail from '../../operationDetail';

export default class CashOutNaturalFeeConfig extends FeeConfig {
  constructor(percents, weekLimit) {
    super(percents);
    this.week_limit = new OperationDetail(weekLimit.amount, weekLimit.currency);
  }
}
