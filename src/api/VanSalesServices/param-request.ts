export type updateVanPositionParam = {
  vanCode: string;
  recordedTypeCode: string;
  driverName: string;
  latitude: number;
  longitude: number;
  recordedAt?: string;
};

export type latestVehicleMileageParam = {
  vanCode: string;
  licensePlate: string;
};

export type saveVehicleMileageParam = {
  vanCode: string;
  licensePlate: string;
  mileage: number;
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

export type salesSummaryByDocumentParam = {
  fromDate: string;
  toDate: string;
  vanCode: string;
};

export type salespersonSalesPerformanceParam = {
  vanCode: string;
  licensePlate: string;
  fromDate: string;
  toDate: string;
};

export type stockBalanceByLocationParam = {
  vanCode: string;
  fromDate: string;
  warehouseLocationKey: number;
};

export type paymentTypeSummaryParam = {
  fromDate: string;
  toDate: string;
};
