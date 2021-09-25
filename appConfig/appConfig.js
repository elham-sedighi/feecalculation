// eslint-disable-next-line import/prefer-default-export
import moment from 'moment';
import { Currency } from '../model/currency';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const config = {
  currency: Currency.EUR,
  currencyFormatter: new Intl.NumberFormat('en-US', {
    currency: Currency.EUR,
    minimumFractionDigits: 2,
  }),
  moment,
  cashInFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-in',
  cashOutJuridicalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical',
  cashOutNaturalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-natural',

  cashInFeeConfig: null,
  cashOutJuridicalFeeConfig: null,
  cashOutNaturalFeeConfig: null,
};
