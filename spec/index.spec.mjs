import CashInFeeCalculator from "../model/fee/feeCalculator/cashInFeeCalculator.js";

describe('feeCalculationApp', () => {
  // eslint-disable-next-line no-undef
  it('cash in fee should be less than 5.00 EUR', () => {
    const cashInFeeCalculator = new CashInFeeCalculator();

    const operation = {
      weekNumber: 2,
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: { amount: 200.00, currency: 'EUR' },
    };

    const fee= cashInFeeCalculator.calculate(operation);
    // eslint-disable-next-line no-undef
    expect(fee).toBeLessThan(5.00);
  });
});
