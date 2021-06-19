/* eslint-disable import/prefer-default-export, max-len */
import moment from 'moment-timezone';

function getEndOfWeekendMode(currentTime) {
  if (currentTime.day() > 1) {
    return currentTime.add(1, 'w').subtract((currentTime.day() - 1), 'd').hours(6).utcOffset(-4);
  }
  return currentTime.add((1 - currentTime.day()), 'd').hours(6).utcOffset(-4);
}

function getStartOfWeekendMode(currentTime) {
  if (currentTime.day() <= 6) {
    const startWeekendModeDate = currentTime.add((5 - currentTime.day()), 'd').hours(20);
    return moment.tz(`${startWeekendModeDate.format('YYYY-MM-DD HH')}-04:00`, 'America/New_York');
  }
  const startWeekendModeDate = currentTime.subtract(2, 'd').hours(20);
  return moment.tz(`${startWeekendModeDate.format('YYYY-MM-DD HH')}-04:00`, 'America/New_York');
}

export function resolveWeekendMode() {
  // Offset return time to NYC Time
  const currentTime = moment().utcOffset(-4);
  const startWeekendMode = getStartOfWeekendMode(moment().utcOffset(-4));
  const endWeekendMode = getEndOfWeekendMode(moment.tz('Asia/Singapore'));
  // moment handles DST automatically
  // check for friday after 7pm since DST
  if (startWeekendMode.day() <= currentTime.day() && currentTime.hours() >= startWeekendMode.hours()) {
    return true;
  }
  // saturday check
  if (currentTime.day() === 6) return true;
  // sunday check to see if before or after 6pm EST
  if (endWeekendMode.day() >= currentTime.day()) {
    return endWeekendMode.hours() >= currentTime.hours();
  }
  return false;
}
