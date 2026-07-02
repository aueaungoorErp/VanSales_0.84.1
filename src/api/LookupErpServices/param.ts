export type FetchDocumentSwitchSettingsParam = Record<string, never>;

export type LookupErpBaseRequest = {
  'BPAPUS-BPAPSV': string;
  'BPAPUS-LOGIN-GUID': string | null;
  'BPAPUS-FUNCTION': string;
  'BPAPUS-PARAM': string;
  'BPAPUS-FILTER': string;
  'BPAPUS-ORDERBY': string;
  'BPAPUS-OFFSET': string;
  'BPAPUS-FETCH': string;
};

export type DocumentSwitchSettingsRow = {
  DSW_OE_AGE?: number | string;
  DSW_PO_AGE?: number | string;
  [key: string]: unknown;
};

export type DocumentSwitchSettingsResponseData = {
  Sy000500?: DocumentSwitchSettingsRow[];
  DOCSWITCH_TABLE?: DocumentSwitchSettingsRow[];
  [key: string]: unknown;
};

export type LookupErpResponse<T = DocumentSwitchSettingsResponseData> = {
  ResponseData?: string | T;
  ResponseCode?: string | number;
  ReasonString?: string;
  [key: string]: unknown;
};

export type FetchCustomerCreditTermsParam = {
  AR_KEY: string | number;
  ARCD_DATE: string;
  ARCD_DEFAULT?: string;
};

export type CustomerCreditTermRow = {
  ARCD_KEY?: string | number;
  ARCD_DEFAULT?: string;
  [key: string]: unknown;
};

export type FetchCustomerCreditTermsResponseData = {
  READARCDBYARKEY?: CustomerCreditTermRow[];
  RECORD_COUNT?: string | number;
  [key: string]: unknown;
};

export type ApplyCustomerCreditTermParam = {
  ARCD_KEY: string | number;
  ARCD_DATE: string;
};

export type CustomerCreditTermAsset = {
  ARCD_DUE_DATE?: string | number;
  ARCD_KEY?: string | number;
  ARPRB_CODE?: string | number;
  ARPRB_KEY?: string | number;
  [key: string]: unknown;
};

export type FetchCustomerDueDateParam = {
  arKey: string | number;
  arcdDate?: string;
};

export type CustomerDueDateResult = {
  arCondition: CustomerCreditTermRow | null;
  asset: CustomerCreditTermAsset | null;
  dueDate: {
    display: string;
    yyyymmdd: string;
    sourceField: string;
    arcdDueDateRaw: string | number | null;
  };
};
