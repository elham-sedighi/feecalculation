import * as moment from 'moment';
import { readFile } from 'fs';

import * as FeeCalculatorFactory from './model/fee/service/feeCalculatorFactory';
import * as Operation from './model/operation';
import * as OperationDetail from './model/operationDetail';

function startFeeCalculation() {
  console.log('start reading data from input file...');
  readFile('./input.json', 'utf8', (err, data) => {
    if (err) console.log('failed to read file!');
    const feeCalculator = new FeeCalculatorFactory();
    [...JSON.parse(data)].forEach((operation) => {
      const opr = new Operation(
        operation.user_id,
        moment(operation.data, 'YYYY-MM-DD'),
        operation.user_type,
        operation.type,
        new OperationDetail(operation.amount, operation.currency),
      );
      const fee = feeCalculator.getFeeCalculatorInstance(opr.user_type, opr.type).calculate(opr);
      console.log(fee);
    });
  });
}

startFeeCalculation();
