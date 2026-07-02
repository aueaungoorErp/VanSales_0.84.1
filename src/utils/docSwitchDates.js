import moment from 'moment';
import { BPAPUS_FUNCTION_DOCSWITCH } from '../constant/bPlusApi';
import {
  ORDER_TYPE_BOOKING,
  ORDER_TYPE_QUOTATION,
} from '../constant/orderTypes';
import {
  getDocSwitch,
  parseDocSwitchResponseData,
} from '../api/LookupErpServices/lookup-erp-services';

export const FALLBACK_DOC_EXPIRY_DAYS = 30;

export const DOC_SWITCH_FIELD_OE = 'DSW_OE_AGE';
export const DOC_SWITCH_FIELD_PO = 'DSW_PO_AGE';

export const shouldFetchDefaultDocDates = arOrderType =>
  arOrderType === ORDER_TYPE_BOOKING ||
  arOrderType === ORDER_TYPE_QUOTATION ||
  arOrderType === 'เสนอราคา';

const toDays = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
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

  const oeDays =
    readDocSwitchField(firstRow, DOC_SWITCH_FIELD_OE) ??
    readDocSwitchField(responseData, DOC_SWITCH_FIELD_OE);
  const poDays =
    readDocSwitchField(firstRow, DOC_SWITCH_FIELD_PO) ??
    readDocSwitchField(responseData, DOC_SWITCH_FIELD_PO);

  const resolvedOeDays = oeDays ?? FALLBACK_DOC_EXPIRY_DAYS;
  const resolvedPoDays = poDays ?? FALLBACK_DOC_EXPIRY_DAYS;

  console.log('[getDocSwitch] extracted days', {
    [DOC_SWITCH_FIELD_OE]: resolvedOeDays,
    [DOC_SWITCH_FIELD_PO]: resolvedPoDays,
  });

  return {
    oeDays: resolvedOeDays,
    poDays: resolvedPoDays,
  };
};

export const getExpiryDaysForOrderType = (arOrderType, parsedDays) => {
  const usesOeAge =
    arOrderType === ORDER_TYPE_BOOKING ||
    arOrderType === ORDER_TYPE_QUOTATION ||
    arOrderType === 'เสนอราคา';

  if (usesOeAge) {
    return {
      usedField: DOC_SWITCH_FIELD_OE,
      usedDays: parsedDays?.oeDays ?? FALLBACK_DOC_EXPIRY_DAYS,
    };
  }

  return {
    usedField: DOC_SWITCH_FIELD_PO,
    usedDays: parsedDays?.poDays ?? FALLBACK_DOC_EXPIRY_DAYS,
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

export const fetchDefaultDocDates = async arOrderType => {
  console.log('[getDocSwitch] fetchDefaultDocDates start', { arOrderType });

  try {
    const response = await getDocSwitch();
    const responseData = parseDocSwitchResponseData(response);
    const parsedDays = parseDocSwitchExpiryDays(responseData);
    const { usedField, usedDays } = getExpiryDaysForOrderType(
      arOrderType,
      parsedDays,
    );
    const dates = buildDocDatesFromToday(usedDays);

    console.log('[getDocSwitch] final dates', {
      arOrderType,
      usedField,
      usedDays: dates.usedDays,
      shipDate: dates.shipDate,
      expiryDate: dates.expiryDate,
    });

    return {
      ...dates,
      usedField,
    };
  } catch (error) {
    console.log('[getDocSwitch] error, using fallback', {
      arOrderType,
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
