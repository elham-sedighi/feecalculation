import FeeConfig from './feeConfig';
import OperationDetail from '../operationDetail';

export default class CashInFeeConfig extends FeeConfig {
  constructor(percents, max) {
    super(percents);
    this.max = new OperationDetail(max?.amount, max?.currency);
  }
}
