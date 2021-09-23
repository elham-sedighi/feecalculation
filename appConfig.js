const config = {};

config.currency = 'EUR';
config.currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: config.currency,
  maximumFractionDigits: 2,
});

config.cashInFeeConfigURL = 'https://private-00d723-paysera.apiary-proxy.com/cash-in';
config.cashOutJuridicalFeeConfigURL = 'https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical';
config.cashOutNaturalFeeConfigURL = 'https://private-00d723-paysera.apiary-proxy.com/cash-out-natural';

module.exports = {
  config,
};
