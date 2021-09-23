import fetch from 'node-fetch';
import * as appConfig from '../../../appConfig';

class CashInFeeCalculator {
  constructor() {
    fetch(appConfig.cashInFeeConfigURL).then((_config) => {
      this.feeConfig = _config;
    });
  }

  calculate(operation) {
    let fee = parseFloat(
      appConfig.currencyFormatter.format((operation.amount * this.feeConfig?.percents) / 100),
    );
    fee = fee > this.feeConfig?.max.amount ? this.feeConfig?.max.amount : fee;
    return fee;
  }
}

module.exports = CashInFeeCalculator;
