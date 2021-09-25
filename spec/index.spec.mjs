import moment from 'moment';
import CashInFeeCalculator from '../fee/feeCalculator/cashInFeeCalculator.js';
import CashOutFeeJuridicalCalculator
  from '../fee/feeCalculator/cashOutFee/cashOutFeeJuridicalCalculator.js';
import CashOutFeeNaturalCalculator from '../fee/feeCalculator/cashOutFee/cashOutFeeNaturalCalculator.js';
import { UserType } from '../model/userType';
import { OperationType } from '../model/operationType';
import { config } from '../appConfig/appConfig';
import { getWeekNumber } from '../utility/dateUtil';

const cashInFeeConfig = {
  percents: 0.03,
  max: {
    amount: 5,
    currency: config.currency,
  },
};
const cashOutNaturalFeeConfig = {
  percents: 0.3,
  week_limit: {
    amount: 1000,
    currency: config.currency,
  },
};
const cashOutJuridicalFeeConfig = {
  percents: 0.3,
  min: {
    amount: 0.5,
    currency: config.currency,
  },
};

describe('feeCalculation', () => {
  describe('cash in', () => {
    it('fee should be less than 5.00 EUR', () => {
      const cashInFeeCalculator = new CashInFeeCalculator(cashInFeeConfig);

      const operation = {
        weekNumber: 2,
        user_id: 1,
        user_type: UserType.natural,
        type: OperationType.cash_in,
        operation: { amount: 200.00, currency: config.currency },
      };

      expect(cashInFeeCalculator.calculate(operation)).toBeLessThan(5.00);
    });
  });

  describe('cash out', () => {
    let cashOutFeeNaturalCalculator;

    beforeAll(() => {
      cashOutFeeNaturalCalculator = new CashOutFeeNaturalCalculator(cashOutNaturalFeeConfig);
    });

    describe('natural persons', () => {
      it('fee should be zero for less than 1000.00 EUR cash out in 1 week', () => {
        const operations = [
          {
            weekNumber: getWeekNumber('2020-12-30'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 100.00, currency: config.currency },
          },
          {
            weekNumber: getWeekNumber('2020-12-31'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 100.00, currency: config.currency },

          },
          {
            weekNumber: getWeekNumber('2021-01-01'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 100.00, currency: config.currency },

          }];

        operations.forEach((operation) => {
          const fee = cashOutFeeNaturalCalculator.calculate(operation);
          expect(fee).toBe(0);
        });
      });
      it('fee should not be zero for more than 1000.00 EUR cash out in 1 week', () => {
        const operations = [
          {
            weekNumber: getWeekNumber('2020-12-30'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 1200.00, currency: config.currency },
          },
          {
            weekNumber: getWeekNumber('2020-12-31'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 100.00, currency: config.currency },

          },
          {
            weekNumber: getWeekNumber('2021-01-01'),
            user_id: 1,
            user_type: UserType.natural,
            type: OperationType.cash_out,
            operation: { amount: 50.00, currency: config.currency },

          }];

        operations.forEach((operation) => {
          const fee = cashOutFeeNaturalCalculator.calculate(operation);
          expect(fee).not.toBe(0);
        });
      });
    });
    describe('legal persons', () => {
      it('fee should be not be less than 0.50 EUR', () => {
        const cashOutFeeJuridicalCalculator = new CashOutFeeJuridicalCalculator(cashOutJuridicalFeeConfig);

        const operation = {
          weekNumber: 2,
          user_id: 1,
          user_type: UserType.juridical,
          type: OperationType.cash_out,
          operation: { amount: 0.10, currency: config.currency },
        };

        expect(cashOutFeeJuridicalCalculator.calculate(operation)).not.toBeLessThan(0.50);
      });
    });
  });
});
