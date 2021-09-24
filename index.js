import moment from 'moment';
import { readFile } from 'fs';
import fetch from 'node-fetch';
import { forkJoin } from 'rxjs';
import FeeCalculatorFactory from './model/fee/service/feeCalculatorFactory';
import Operation from './model/operation';
import { config } from './appConfig';
import CashInFeeConfig from './model/fee/feeConfig/cashInFeeConfig';
import CashOutNaturalFeeConfig from './model/fee/feeConfig/cashOutNaturalFeeConfig';
import CashOutJuridicalFeeConfig from './model/fee/feeConfig/cashOutJuridicalFeeConfig';

global.feeConfigs = new Map();

function getFeeConfigs() {
  return forkJoin([
    fetch(config.cashInFeeConfigURL),
    fetch(config.cashOutNaturalFeeConfigURL),
    fetch(config.cashOutJuridicalFeeConfigURL)]);
}

function startFeeCalculation() {
  console.log('start reading data from input file...');
  readFile('./input.json', 'utf8', (err, data) => {
    if (err) console.log('failed to read file!');
    const feeCalculator = new FeeCalculatorFactory();
    [...JSON.parse(data)].forEach((operation) => {
      const opr = new Operation(
        operation.user_id,
        moment(operation.date, 'YYYY-MM-DD').week(),
        operation.user_type,
        operation.type,
        operation.operation.amount,
        operation.operation.currency,
      );
      const calculator = feeCalculator.getFeeCalculatorInstance(opr.user_type, opr.type);
      const fee = calculator.calculate(opr);
      console.log(fee);
    });
  });
}

/* getFeeConfigs()
  .subscribe(([cashInFeeConfig, cashOutNaturalFeeConfig, cashOutJuridicalFeeConfig]) => {
    global.feeConfigs.set('cash_in', new CashInFeeConfig(cashInFeeConfig.percents, cashInFeeConfig.max));
    global.feeConfigs.set('cash_out_natural', new CashOutNaturalFeeConfig(cashOutNaturalFeeConfig.percents, cashOutNaturalFeeConfig.week_limit));
    global.feeConfigs.set('cash_out_juridical', new CashOutJuridicalFeeConfig(cashOutJuridicalFeeConfig.percents, cashOutJuridicalFeeConfig.min));
    startFeeCalculation();
  }); */

global.feeConfigs.set('cash_in', new CashInFeeConfig(0.03, {
  amount: 5,
  currency: 'EUR',
}));
global.feeConfigs.set('cash_out_natural', new CashOutNaturalFeeConfig(0.3, {
  amount: 1000,
  currency: 'EUR',
}));
global.feeConfigs.set('cash_out_juridical', new CashOutJuridicalFeeConfig(0.3, {
  amount: 0.5,
  currency: 'EUR',
}));
startFeeCalculation();
