import CashInFeeCalculator from "../model/fee/feeCalculator/cashInFeeCalculator.js";
import CashOutFeeJuridicalCalculator
    from "../model/fee/feeCalculator/cashOutFee/cashOutFeeJuridicalCalculator.js";
import CashOutFeeNaturalCalculator from "../model/fee/feeCalculator/cashOutFee/cashOutFeeNaturalCalculator.js";
import moment from "moment";

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

export const config = {
    currency: 'EUR',
    currencyFormatter: new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        minimumFractionDigits: 2,
    }),
    cashInFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-in',
    cashOutJuridicalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical',
    cashOutNaturalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-natural',

    cashInFeeConfig: {
        percents: 0.03,
        max: {
            amount: 5,
            currency: 'EUR',
        }
    },
    cashOutNaturalFeeConfig: {
        percents: 0.3,
        week_limit: {
            amount: 1000,
            currency: 'EUR',
        }
    },
    cashOutJuridicalFeeConfig: {
        percents: 0.3,
        min: {
            amount: 0.5,
            currency: 'EUR',
        }
    },
};

describe('feeCalculation', () => {

    describe('cash in', () => {
        it('fee should be less than 5.00 EUR', () => {
            const cashInFeeCalculator = new CashInFeeCalculator(
                config.currencyFormatter, config.cashInFeeConfig);

            const operation = {
                weekNumber: 2,
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: {amount: 200.00, currency: 'EUR'},
            };

            expect(cashInFeeCalculator.calculate(operation)).toBeLessThan(5.00);
        });
    })

    describe('cash out', () => {

        let cashOutFeeNaturalCalculator;

        beforeAll(() => {
            cashOutFeeNaturalCalculator = new CashOutFeeNaturalCalculator(
                config.currencyFormatter, config.cashOutNaturalFeeConfig);
        })

        describe('natural persons', () => {
            it('fee should be zero for less than 1000.00 EUR cash out in 1 week', () => {
                const operations = [
                    {
                        weekNumber: moment("2020-12-30", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 100.00, currency: 'EUR'}
                    },
                    {
                        weekNumber: moment("2020-12-31", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 100.00, currency: 'EUR'},

                    },
                    {
                        weekNumber: moment("2021-01-01", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 100.00, currency: 'EUR'},

                    }];

                operations.forEach(operation => {
                    const fee = cashOutFeeNaturalCalculator.calculate(operation);
                    expect(fee).toBe(0);
                })
            })
            it('fee should not be zero for more than 1000.00 EUR cash out in 1 week', () => {
                const operations = [
                    {
                        weekNumber: moment("2020-12-30", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 1200.00, currency: 'EUR'}
                    },
                    {
                        weekNumber: moment("2020-12-31", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 100.00, currency: 'EUR'},

                    },
                    {
                        weekNumber: moment("2021-01-01", 'YYYY-MM-DD').week(),
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: {amount: 50.00, currency: 'EUR'},

                    }];

                operations.forEach(operation => {
                    const fee = cashOutFeeNaturalCalculator.calculate(operation);
                    expect(fee).not.toBe(0);
                })
            })
        })
        describe('legal persons', () => {
            it('fee should be not be less than 0.50 EUR', () => {
                const cashOutFeeJuridicalCalculator = new CashOutFeeJuridicalCalculator(
                    config.currencyFormatter, config.cashOutJuridicalFeeConfig);

                const operation = {
                    weekNumber: 2,
                    user_id: 1,
                    user_type: 'juridical',
                    type: 'cash_out',
                    operation: {amount: 2000.00, currency: 'EUR'},
                };

                expect(cashOutFeeJuridicalCalculator.calculate(operation)).toBeGreaterThan(0.50);
            });
        })
    });
})
