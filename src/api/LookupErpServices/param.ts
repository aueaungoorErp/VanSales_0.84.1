export type getDocSwitchParam = Record<string, never>;

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

export type DocSwitchRow = {
  DSW_OE_AGE?: number | string;
  DSW_PO_AGE?: number | string;
  [key: string]: unknown;
};

export type DocSwitchResponseData = {
  Sy000500?: DocSwitchRow[];
  DOCSWITCH_TABLE?: DocSwitchRow[];
  [key: string]: unknown;
};

export type LookupErpResponse<T = DocSwitchResponseData> = {
  ResponseData?: string | T;
  [key: string]: unknown;
};
