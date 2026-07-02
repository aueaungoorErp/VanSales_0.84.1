import moment from 'moment';

export const formatErpDueDateForDisplay = erpDueDate => {
  const raw = String(erpDueDate ?? '').trim();

  if (!raw || raw.length < 8) {
    return null;
  }

  const yyyymmdd = raw.substring(0, 8);
  const parsed = moment(yyyymmdd, 'YYYYMMDD', true);

  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : null;
};

export const formatDisplayDateToErpYyyymmdd = displayDate => {
  const parsed = moment(displayDate, 'DD/MM/YYYY', true);

  if (!parsed.isValid()) {
    return null;
  }

  return parsed.format('YYYYMMDD');
};

export const buildOneMonthFallbackDueDate = documentDate => {
  const base = documentDate ? moment(documentDate) : moment();

  return base.isValid()
    ? base.clone().add(1, 'months').format('YYYYMMDD')
    : moment().add(1, 'months').format('YYYYMMDD');
};

export const buildDueDateFromCreditTerm = (erpDueDate, documentDate) => {
  const display =
    formatErpDueDateForDisplay(erpDueDate) ??
    moment(buildOneMonthFallbackDueDate(documentDate), 'YYYYMMDD').format(
      'DD/MM/YYYY',
    );
  const yyyymmdd =
    formatDisplayDateToErpYyyymmdd(display) ??
    buildOneMonthFallbackDueDate(documentDate);

  return {
    display,
    yyyymmdd,
    sourceField: erpDueDate ? 'ARCD_DUE_DATE' : 'fallback',
    arcdDueDateRaw: erpDueDate ?? null,
  };
};

export const resolveOrderDueDateForSave = (orderHeader, customerSelectState) => {
  if (orderHeader?.VDI_DUE_DATE) {
    const fromHeader = moment(orderHeader.VDI_DUE_DATE, 'YYYYMMDD', true);

    if (fromHeader.isValid()) {
      return fromHeader.format('YYYYMMDD');
    }
  }

  if (customerSelectState?.dueDate?.yyyymmdd) {
    return customerSelectState.dueDate.yyyymmdd;
  }

  return buildOneMonthFallbackDueDate(orderHeader?.VDI_DATE);
};

export const resolveDocumentDateForCreditTerms = orderHeader => {
  if (orderHeader?.VDI_DATE) {
    const documentDate = moment(orderHeader.VDI_DATE);

    if (documentDate.isValid()) {
      return documentDate.format('YYYYMMDD');
    }
  }

  return moment().format('YYYYMMDD');
};
