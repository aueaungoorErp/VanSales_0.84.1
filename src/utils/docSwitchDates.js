import moment from 'moment';
import { BPAPUS_FUNCTION_DOCSWITCH } from '../constant/bPlusApi';
import {
  ORDER_TYPE_BOOKING,
  ORDER_TYPE_QUOTATION,
} from '../constant/orderTypes';
import { getDocSwitch } from '../api/docSwitch';

export const FALLBACK_DOC_EXPIRY_DAYS = 30;

export const shouldFetchDefaultDocDates = arOrderType =>
  arOrderType === ORDER_TYPE_BOOKING ||
  arOrderType === ORDER_TYPE_QUOTATION ||
  arOrderType === 'เสนอราคา';

const toDays = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const pickNumericByKeyPattern = (record, patterns) => {
  if (!record || typeof record !== 'object') {
    return null;
  }

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = String(key).toUpperCase();
    const matches = patterns.some(pattern => normalizedKey.includes(pattern));

    if (matches) {
      const days = toDays(value);
      if (days !== null) {
        return days;
      }
    }
  }

  return null;
};

const getDocSwitchRows = responseData => {
  if (!responseData || typeof responseData !== 'object') {
    return [];
  }

  if (Array.isArray(responseData[BPAPUS_FUNCTION_DOCSWITCH])) {
    return responseData[BPAPUS_FUNCTION_DOCSWITCH];
  }

  if (Array.isArray(responseData.Sy000500)) {
    return responseData.Sy000500;
  }

  if (Array.isArray(responseData.DOCSWITCH_TABLE)) {
    return responseData.DOCSWITCH_TABLE;
  }

  const firstArray = Object.values(responseData).find(Array.isArray);
  return Array.isArray(firstArray) ? firstArray : [];
};

const readDocSwitchField = (source, fieldName) => {
  if (!source || typeof source !== 'object') {
    return null;
  }

  return toDays(source[fieldName]);
};

export const parseDocSwitchExpiryDays = responseData => {
  const rows = getDocSwitchRows(responseData);
  const firstRow = rows[0] ?? responseData;

  console.log('[getDocSwitch] ResponseData parsed', JSON.stringify(responseData));
  console.log('[getDocSwitch] rows', JSON.stringify(rows));
  console.log('[getDocSwitch] firstRow keys', Object.keys(firstRow ?? {}));

  let poDays =
    readDocSwitchField(firstRow, 'DSW_PO_AGE') ??
    readDocSwitchField(responseData, 'DSW_PO_AGE');
  let bkDays =
    readDocSwitchField(firstRow, 'DSW_OE_AGE') ??
    readDocSwitchField(responseData, 'DSW_OE_AGE');

  if (poDays === null || bkDays === null) {
    const poPatterns = ['PO_AGE', 'PO', 'PURCHASE'];
    const bkPatterns = ['OE_AGE', 'BK', 'BOOK', 'RESERV', 'RESERVE'];

    poDays =
      poDays ??
      pickNumericByKeyPattern(firstRow, poPatterns) ??
      pickNumericByKeyPattern(responseData, poPatterns);
    bkDays =
      bkDays ??
      pickNumericByKeyPattern(firstRow, bkPatterns) ??
      pickNumericByKeyPattern(responseData, bkPatterns);
  }

  const resolvedBkDays = bkDays ?? poDays ?? FALLBACK_DOC_EXPIRY_DAYS;
  const resolvedPoDays = poDays ?? bkDays ?? FALLBACK_DOC_EXPIRY_DAYS;

  console.log('[getDocSwitch] extracted days', {
    poDays: resolvedPoDays,
    bkDays: resolvedBkDays,
    usedDays: resolvedBkDays,
    parseSource: {
      DSW_PO_AGE: poDays,
      DSW_OE_AGE: bkDays,
    },
  });

  return {
    poDays: resolvedPoDays,
    bkDays: resolvedBkDays,
  };
};

export const buildDocDatesFromToday = days => {
  const safeDays =
    Number.isFinite(Number(days)) && Number(days) >= 0
      ? Number(days)
      : FALLBACK_DOC_EXPIRY_DAYS;
  const formatted = moment().add(safeDays, 'days').format('DD/MM/YYYY');

  return {
    shipDate: formatted,
    expiryDate: formatted,
    usedDays: safeDays,
  };
};

export const fetchDefaultDocDates = async () => {
  console.log('[getDocSwitch] fetchDefaultDocDates start');

  try {
    const response = await getDocSwitch();
    const responseData =
      typeof response?.ResponseData === 'string'
        ? JSON.parse(response.ResponseData)
        : response?.ResponseData;

    const { bkDays } = parseDocSwitchExpiryDays(responseData);
    const dates = buildDocDatesFromToday(bkDays);

    console.log('[getDocSwitch] final dates', {
      usedDays: dates.usedDays,
      shipDate: dates.shipDate,
      expiryDate: dates.expiryDate,
    });

    return dates;
  } catch (error) {
    console.log('[getDocSwitch] error, using fallback', {
      message: error?.message,
      fallbackDays: FALLBACK_DOC_EXPIRY_DAYS,
    });

    return buildDocDatesFromToday(FALLBACK_DOC_EXPIRY_DAYS);
  }
};

export const applyDefaultDocDatesToHeader = (header, dates) => {
  if (!header || !dates?.shipDate || !dates?.expiryDate) {
    return;
  }

  header.VDI_SHIP_DATE = moment(dates.shipDate, 'DD/MM/YYYY').format('YYYYMMDD');
  header.VDI_EXP_DATE = moment(dates.expiryDate, 'DD/MM/YYYY').format('YYYYMMDD');
};
