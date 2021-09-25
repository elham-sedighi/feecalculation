import { readFile } from 'fs';
import fetch from 'node-fetch';
import { forkJoin, Observable } from 'rxjs';
import { config } from './appConfig/appConfig';
import FeeCalculatorFactory from './fee/feeCalculatorFactory';
import Operation from './model/operation';

import CashInFeeConfig from './model/feeConfig/cashInFeeConfig';
import CashOutNaturalFeeConfig from './model/feeConfig/cashOutNaturalFeeConfig';
import CashOutJuridicalFeeConfig from './model/feeConfig/cashOutJuridicalFeeConfig';
import { getWeekNumber } from './utility/dateUtil';
import { Currency } from './model/currency';

function getFeeConfigs() {
  console.log('start getting fee config data from API...');
  return forkJoin([
    fetch(config.cashInFeeConfigURL).then((res) => res.json()),
    fetch(config.cashOutNaturalFeeConfigURL).then((res) => res.json()),
    fetch(config.cashOutJuridicalFeeConfigURL).then((res) => res.json())]);
}

function readInputData(InputDataPath) {
  console.log('start reading data from input file...');
  return new Observable((subscriber) => {
    readFile(InputDataPath, 'utf8', (err, data) => {
      if (err) subscriber.error(err);
      subscriber.next([...JSON.parse(data)]);
      subscriber.complete();
    });
  });
}

function calculateFees(inputData) {
  console.log('start calculating fees...');
  const feeCalculator = new FeeCalculatorFactory();
  inputData.forEach((operation) => {
    const opr = new Operation(
      operation.user_id,
      getWeekNumber(operation.date),
      operation.user_type,
      operation.type,
      operation.operation.amount,
      operation.operation.currency,
    );
    const calculator = feeCalculator.getFeeCalculatorInstance(opr.user_type, opr.type);
    const fee = calculator.calculate(opr);
    console.log(new Intl.NumberFormat('en-US', {
      currency: Currency.EUR,
      minimumFractionDigits: 2,
    }).format(fee));
  });
  console.log('fee calculation finished successfully!');
}

function runFeeCalculationApp() {
  getFeeConfigs().subscribe(
    ([cashInFeeConfig, cashOutNaturalFeeConfig, cashOutJuridicalFeeConfig]) => {
      config.cashInFeeConfig = new CashInFeeConfig(cashInFeeConfig.percents, cashInFeeConfig.max);
      config.cashOutNaturalFeeConfig = new CashOutNaturalFeeConfig(
        cashOutNaturalFeeConfig.percents, cashOutNaturalFeeConfig.week_limit,
      );
      config.cashOutJuridicalFeeConfig = new CashOutJuridicalFeeConfig(
        cashOutJuridicalFeeConfig.percents, cashOutJuridicalFeeConfig.min,
      );
      readInputData('./asset/input.json').subscribe((inputData) => {
        calculateFees(inputData);
      }, (err) => {
        console.log(`failed to read file!_${err}`);
      });
    }, (error) => {
      console.log(`Failed to get fee config data from API!_${error}`);
      config.cashInFeeConfig = new CashInFeeConfig(0.03, {
        amount: 5,
        currency: config.currency,
      });
      config.cashOutNaturalFeeConfig = new CashOutNaturalFeeConfig(0.3, {
        amount: 1000,
        currency: config.currency,
      });
      config.cashOutJuridicalFeeConfig = new CashOutJuridicalFeeConfig(0.3, {
        amount: 0.5,
        currency: config.currency,
      });
      console.log('fee configs was set from local data!');
      readInputData('./asset/input.json').subscribe((inputData) => {
        calculateFees(inputData);
      }, (err) => {
        console.log(`failed to read file!_${err}`);
      });
    },
  );
}

runFeeCalculationApp();
