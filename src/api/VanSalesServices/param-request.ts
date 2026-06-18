export type updateVanPositionParam = {
  vanCode: string;
  recordedTypeCode: string;
  driverName: string;
  latitude: number;
  longitude: number;
  recordedAt?: string;
};

export type customerReportPerformanceParam = {
  fromDate: string;
  toDate: string;
  vanCode: string;
};

export type productCategoryReportPerformanceParam = {
  fromDate: string;
  toDate: string;
  vanCode: string;
};
