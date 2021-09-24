import FeeConfig from './feeConfig';
import OperationDetail from '../../operationDetail';

export default class CashOutJuridicalFeeConfig extends FeeConfig {
  constructor(percents, min) {
    super(percents);
    this.min = new OperationDetail(min?.amount, min?.currency);
  }
}
