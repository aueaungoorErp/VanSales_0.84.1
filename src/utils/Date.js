// import { monthItems } from '../constant/lov'
import moment from 'moment';

export const generateYearForPicker = () => {
  const result = [];

  for (var index = 2499; index < 2599; index++) {
    result.push(index);
  }

  return result;
};

export const generatedayForPicker = (month, year) => {
  let dateNo = 31;
  let result = [];

  if (
    month === 0 ||
    month === 2 ||
    month === 4 ||
    month === 6 ||
    month === 7 ||
    month === 9 ||
    month === 11
  ) {
    dateNo = 31;
  } else if (month === 3 || month === 5 || month === 8 || month === 10) {
    dateNo = 30;
  } else if (month === 1) {
    if ((year - 543) % 4 === 0) {
      dateNo = 29;
    } else {
      dateNo = 28;
    }
  }

  for (var i = 1; i <= dateNo; i++) {
    result.push(i);
  }

  return result;
};

export const getMonthNumberFromMonthName = (monthItems, monthName) => {
  for (var i = 0; i < monthItems.length; i++) {
    if (monthName === monthItems[i]) {
      return i;
    }
  }

  return 0;
};

export const toBuddhistYear = (dateStr, symbol = '/', format = 1) => {
  var christianYear = moment().format('YYYY');

  var newDate = '';

  if (symbol === '/') {
    if (format === 1) {
      newDate = moment(dateStr, 'DD/MM/YYYY').format('YYYY/MM/DD');
    }
  } else if (symbol === '-') {
    if (format === 2) {
      newDate = moment(dateStr, 'YYYY-MM-DD').format('YYYY/MM/DD');
    }
  }

  var newFormatDate = newDate.split('/');

  var buddhishYear = (parseInt(newFormatDate[0]) + 543).toString();
  newFormatDate =
    newFormatDate[2] + '/' + newFormatDate[1] + '/' + buddhishYear;

  return newFormatDate;
};

export const toBuddhistYearShowMonthAndYearForHeaderDatePicker = (
  dateStr,
  symbol = '-',
) => {
  var christianYear = moment().format('YYYY');
  var buddhishYear = (parseInt(christianYear) + 543).toString();
  var newDate = dateStr.split('T');

  var newFormatDate = newDate[0].split(symbol);

  newFormatDate = newFormatDate[1] + ' ' + buddhishYear;

  return newFormatDate;
};
