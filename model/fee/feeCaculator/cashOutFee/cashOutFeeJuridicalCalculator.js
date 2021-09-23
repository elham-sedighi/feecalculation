const fetch = require('node-fetch');
const CashOutFeeCalculator = require('./cashOutFeeCalculator');
const appConfig = require('../../../../appConfig');

class CashOutFeeJuridicalCalculator extends CashOutFeeCalculator {
  constructor() {
    super();
    fetch(appConfig.cashOutJuridicalFeeConfigURL).then((_config) => {
      this.feeConfig = _config;
    });
  }

  calculate(operation) {
    let fee = parseFloat(appConfig.currencyFormatter.format(
      (operation.operation.amount * this.feeConfig?.percents) / 100,
    ));
    fee = fee < this.feeConfig?.min.amount
      ? this.feeConfig?.min.amount : fee;
    return fee;
  }
}

module.exports = CashOutFeeJuridicalCalculator;
