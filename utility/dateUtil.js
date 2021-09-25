import { config } from '../appConfig/appConfig';

// eslint-disable-next-line import/prefer-default-export
export function getWeekNumber(stringDate) {
  return config.moment(stringDate, 'YYYY-MM-DD').week();
}
