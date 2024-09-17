Vue.filter('moment', (value, formatString) => {
  if (!value) return '';
  return moment(value).format(formatString);
});

Vue.filter('currency', (value, locale = 'en-US', currency = 'USD') => {
  if (!value) return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
});