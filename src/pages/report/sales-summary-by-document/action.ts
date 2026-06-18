import moment from 'moment';

type AnyRecord = Record<string, any>;

type DocumentSummaryItem = {
  DI_REF: string;
  AR_NAME: string;
  TRH_N_ITEMS: number;
  TRH_N_QTY: number;
  ARD_G_KEYIN: number;
  ARD_TDSC_KEYINV: number;
  ARD_A_AMT: number;
};

const toSafeNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatGroupDate = (value: unknown): string => {
  if (!value) {
    return '-';
  }

  if (typeof value === 'string' && moment(value, 'DD/MM/YYYY', true).isValid()) {
    return value;
  }

  if (moment(value).isValid()) {
    return moment(value).format('DD/MM/YYYY');
  }

  return String(value);
};

const normalizeDocumentItem = (row: AnyRecord): DocumentSummaryItem => ({
  DI_REF:
    row?.DI_REF ??
    row?.diRef ??
    row?.documentNo ??
    row?.docNo ??
    row?.docRef ??
    '-',
  AR_NAME:
    row?.AR_NAME ??
    row?.arName ??
    row?.customerName ??
    row?.customer ??
    '-',
  TRH_N_ITEMS: toSafeNumber(
    row?.TRH_N_ITEMS ?? row?.trhNItems ?? row?.itemCount ?? row?.countItems,
  ),
  TRH_N_QTY: toSafeNumber(
    row?.TRH_N_QTY ?? row?.trhNQty ?? row?.qtyCount ?? row?.countQty,
  ),
  ARD_G_KEYIN: toSafeNumber(
    row?.ARD_G_KEYIN ??
      row?.ardGKeyin ??
      row?.grossAmount ??
      row?.beforeDiscountAmount,
  ),
  ARD_TDSC_KEYINV: toSafeNumber(
    row?.ARD_TDSC_KEYINV ??
      row?.ardTdscKeyinv ??
      row?.discountAmount ??
      row?.billDiscountAmount,
  ),
  ARD_A_AMT: toSafeNumber(
    row?.ARD_A_AMT ?? row?.ardAAmt ?? row?.netAmount ?? row?.saleAmount ?? row?.amount,
  ),
});

const extractGroupDate = (row: AnyRecord) =>
  formatGroupDate(
    row?.GROUP_NAME ??
      row?.DATE ??
      row?.date ??
      row?.DOC_DATE ??
      row?.docDate ??
      row?.DI_DATE,
  );

const extractDocumentGroupName = (row: AnyRecord) =>
  row?.DOCGROUP ??
  row?.docGroup ??
  row?.documentGroupName ??
  row?.documentTypeName ??
  row?.dtThaiDesc ??
  row?.documentType ??
  'ไม่ระบุประเภทเอกสาร';

const isLegacyNormalizedPayload = (payload: AnyRecord) =>
  Array.isArray(payload?.ITEMS) &&
  payload.ITEMS.every(
    (group: AnyRecord) =>
      Array.isArray(group?.ITEMS) &&
      group.ITEMS.every(
        (documentGroup: AnyRecord) =>
          typeof documentGroup?.DOCGROUP === 'string' &&
          Array.isArray(documentGroup?.ITEMS),
      ),
  );

export const normalizeSalesSummaryByDocumentPayload = (
  payload: AnyRecord = {},
) => {
  if (isLegacyNormalizedPayload(payload)) {
    return payload;
  }

  const rawGroups =
    payload?.RPT_DATA?.RESULT ??
    payload?.RESULT ??
    payload?.items ??
    payload?.ITEMS ??
    payload?.data ??
    [];

  const groupedSource = Array.isArray(rawGroups) ? rawGroups : [];
  const groupedByDate = new Map<string, AnyRecord[]>();

  groupedSource.forEach((row: AnyRecord) => {
    const groupDate = extractGroupDate(row);
    const existingRows = groupedByDate.get(groupDate) || [];
    existingRows.push(row);
    groupedByDate.set(groupDate, existingRows);
  });

  const normalizedItems = Array.from(groupedByDate.entries()).map(
    ([GROUP_NAME, rows]) => {
      const groupedByDoc = new Map<string, DocumentSummaryItem[]>();

      rows.forEach((row: AnyRecord) => {
        const docGroupName = extractDocumentGroupName(row);
        const existingRows = groupedByDoc.get(docGroupName) || [];
        existingRows.push(normalizeDocumentItem(row));
        groupedByDoc.set(docGroupName, existingRows);
      });

      const documentGroups = Array.from(groupedByDoc.entries()).map(
        ([DOCGROUP, items]) => ({
          DOCGROUP,
          ITEMS: items,
        }),
      );

      return {
        GROUP_NAME,
        ITEMS: documentGroups,
        GROUP_AMT: documentGroups.reduce(
          (sum, group) =>
            sum +
            group.ITEMS.reduce(
              (itemSum: number, item: DocumentSummaryItem) =>
                itemSum + item.ARD_A_AMT,
              0,
            ),
          0,
        ),
      };
    },
  );

  const summaryGroupsMap = new Map<string, AnyRecord>();

  normalizedItems.forEach((dateGroup: AnyRecord) => {
    dateGroup.ITEMS.forEach((documentGroup: AnyRecord) => {
      const existingSummary = summaryGroupsMap.get(documentGroup.DOCGROUP) || {
        GROUP_NAME: documentGroup.DOCGROUP,
        GROUP_ITEM_TRH_N_ITEMS: 0,
        GROUP_ITEM_TRH_N_QTY: 0,
        GROUP_ITEM_ARD_G_KEYIN: 0,
        GROUP_ITEM_ARD_TDSC_KEYINV: 0,
        GROUP_ITEM_AMT: 0,
      };

      documentGroup.ITEMS.forEach((item: DocumentSummaryItem) => {
        existingSummary.GROUP_ITEM_TRH_N_ITEMS += item.TRH_N_ITEMS;
        existingSummary.GROUP_ITEM_TRH_N_QTY += item.TRH_N_QTY;
        existingSummary.GROUP_ITEM_ARD_G_KEYIN += item.ARD_G_KEYIN;
        existingSummary.GROUP_ITEM_ARD_TDSC_KEYINV += item.ARD_TDSC_KEYINV;
        existingSummary.GROUP_ITEM_AMT += item.ARD_A_AMT;
      });

      summaryGroupsMap.set(documentGroup.DOCGROUP, existingSummary);
    });
  });

  const summaryGroups = Array.from(summaryGroupsMap.values());

  return {
    ...payload,
    ITEMS: normalizedItems,
    SUMMARY_SECTION: {
      GROUP: summaryGroups,
      SUM_TRH_N_QTY: summaryGroups.reduce(
        (sum, row) => sum + toSafeNumber(row.GROUP_ITEM_TRH_N_ITEMS),
        0,
      ),
      SUM_TRH_N_ITEMS: summaryGroups.reduce(
        (sum, row) => sum + toSafeNumber(row.GROUP_ITEM_TRH_N_QTY),
        0,
      ),
      SUM_ARD_G_KEYIN: summaryGroups.reduce(
        (sum, row) => sum + toSafeNumber(row.GROUP_ITEM_ARD_G_KEYIN),
        0,
      ),
      SUM_ARD_TDSC_KEYINV: summaryGroups.reduce(
        (sum, row) => sum + toSafeNumber(row.GROUP_ITEM_ARD_TDSC_KEYINV),
        0,
      ),
      SUM_AMT: summaryGroups.reduce(
        (sum, row) => sum + toSafeNumber(row.GROUP_ITEM_AMT),
        0,
      ),
    },
  };
};
