// eslint-disable-next-line import/prefer-default-export
export const config = {
  currency: 'EUR',
  currencyFormatter: new Intl.NumberFormat('en-US', {
    currency: 'EUR',
    minimumFractionDigits: 2,
  }),
  cashInFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-in',
  cashOutJuridicalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical',
  cashOutNaturalFeeConfigURL: 'https://private-00d723-paysera.apiary-proxy.com/cash-out-natural',

  cashInFeeConfig: null,
  cashOutJuridicalFeeConfig: null,
  cashOutNaturalFeeConfig: null,
};
