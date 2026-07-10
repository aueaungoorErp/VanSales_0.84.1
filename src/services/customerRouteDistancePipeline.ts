import { assessLongdoApiKeyAvailability, clearCustomerRouteDistanceCache, formatDistanceLabel, getCustomerRouteDistanceCache, getDistanceBetweenCoordinates, getDistanceItemsFromCurrentLocation, hasCompleteCoordinate, isWithinDistanceThreshold, mergeCustomerRouteDistanceCache, parseCoordinate } from './longdomap';
import { mergeCustomerRouteLoadSession } from './customerRouteLoadSession';
type CoordinateValue = string | number | null | undefined;
type LocationCoordinate = {
  latitude: CoordinateValue;
  longitude: CoordinateValue;
};
type NumericPosition = {
  latitude: number | null;
  longitude: number | null;
};
export type CustomerRouteDistanceItem = {
  distance: number | null;
  distanceText: string;
  [key: string]: any;
};
export type PipelineLoadSignal = {
  loadId: number;
  getCurrentLoadId: () => number;
};
export class CustomerRoutePipelineAbortedError extends Error {
  constructor() {
    super('CUSTOMER_ROUTE_PIPELINE_ABORTED');
    this.name = 'CustomerRoutePipelineAbortedError';
  }
}
const formatElapsedMs = (startedAt: number) => `${Date.now() - startedAt} ms`;
export const assertPipelineNotAborted = (signal?: PipelineLoadSignal) => {
  if (signal && signal.loadId !== signal.getCurrentLoadId()) {
    throw new CustomerRoutePipelineAbortedError();
  }
};
const sortCustomersByDistance = <T extends CustomerRouteDistanceItem,>(customers: T[]): T[] => {
  return [...customers].sort((left, right) => {
    const leftHasDistance = typeof left.distance === 'number';
    const rightHasDistance = typeof right.distance === 'number';
    if (leftHasDistance && rightHasDistance) {
      return (left.distance ?? 0) - (right.distance ?? 0);
    }
    if (leftHasDistance) {
      return -1;
    }
    if (rightHasDistance) {
      return 1;
    }
    return 0;
  });
};
export type ProcessCustomerRouteDistancesParams = {
  listItems: any[];
  currentLocation: LocationCoordinate;
  lastPosition: NumericPosition;
  vanCode: string;
  hasMore: boolean;
  totalAvailable: number;
  onSetLastPosition?: (position: NumericPosition) => void;
  signal?: PipelineLoadSignal;
};
export type ProcessCustomerRouteDistancesResult = {
  sortedItems: CustomerRouteDistanceItem[];
  alertReason?: 'missing' | 'limit';
  recomputedCount: number;
  cachedCount: number;
};
export const processCustomerRouteDistances = async ({
  listItems,
  currentLocation,
  lastPosition,
  vanCode,
  hasMore,
  totalAvailable,
  onSetLastPosition,
  signal
}: ProcessCustomerRouteDistancesParams): Promise<ProcessCustomerRouteDistancesResult> => {
  const buildStartedAt = Date.now();
  assertPipelineNotAborted(signal);
  if (!Array.isArray(listItems) || listItems.length === 0) {
    return {
      sortedItems: [],
      recomputedCount: 0,
      cachedCount: 0
    };
  }
  const longdoAvailability = await assessLongdoApiKeyAvailability(vanCode);
  assertPipelineNotAborted(signal);
  if (!longdoAvailability.ok) {
    const alertReason = longdoAvailability.reason;
    const sortedItems = listItems.map(item => ({
      ...item,
      distance: null,
      distanceText: alertReason === 'missing' ? 'ยังไม่ได้ตั้งค่า API Key' : 'API Key limit หมด'
    }));
    await mergeCustomerRouteLoadSession({
      cachedItems: sortedItems,
      totalLoaded: listItems.length,
      totalAvailable,
      hasMore,
      updatedAt: new Date().toISOString()
    });
    return {
      sortedItems,
      alertReason,
      recomputedCount: 0,
      cachedCount: 0
    };
  }
  const canCompareDistance = hasCompleteCoordinate(currentLocation);
  const currentNumericPosition = {
    latitude: parseCoordinate(currentLocation.latitude),
    longitude: parseCoordinate(currentLocation.longitude)
  };
  const customerLocations = listItems.map(item => ({
    latitude: item?.ADDB_GPS_LAT_S ?? null,
    longitude: item?.ADDB_GPS_LONG_S ?? null
  }));
  const hasLastPosition = hasCompleteCoordinate(lastPosition);
  const distanceFromLastPosition = hasLastPosition ? getDistanceBetweenCoordinates(currentLocation, lastPosition) : null;
  const shouldReuseCachedDistances = canCompareDistance && hasLastPosition && isWithinDistanceThreshold(currentLocation, lastPosition, 15);
  const shouldClearDistanceCache = canCompareDistance && !shouldReuseCachedDistances;
  const cachePreparationStartedAt = Date.now();
  if (shouldClearDistanceCache) {
    await clearCustomerRouteDistanceCache();
  }
  assertPipelineNotAborted(signal);
  const cachedDistances = shouldReuseCachedDistances ? await getCustomerRouteDistanceCache() : {};
  const distanceEntriesByIndex: Record<number, {
    distance: number | null;
    distanceText: string;
  }> = {};
  const customersToCompute: Array<{
    index: number;
    arKey: string | null;
    location: {
      latitude: string | number | null;
      longitude: string | number | null;
    };
  }> = [];
  listItems.forEach((item, index) => {
    if (!canCompareDistance || !hasCompleteCoordinate(customerLocations[index])) {
      return;
    }
    const arKey = item.AR_KEY !== undefined && item.AR_KEY !== null ? String(item.AR_KEY) : null;
    const cachedEntry = arKey && shouldReuseCachedDistances ? cachedDistances[arKey] : null;
    if (cachedEntry && typeof cachedEntry.distanceText === 'string') {
      distanceEntriesByIndex[index] = cachedEntry;
      return;
    }
    customersToCompute.push({
      index,
      arKey,
      location: customerLocations[index]
    });
  });
  let alertReason: 'missing' | 'limit' | undefined;
  const cacheUpdates: Record<string, {
    distance: number | null;
    distanceText: string;
  }> = {};
  if (customersToCompute.length > 0) {
    const distanceApiStartedAt = Date.now();
    let computedDistanceItems: Array<{
      item: {
        index: number;
        arKey: string | null;
        location: {
          latitude: string | number | null;
          longitude: string | number | null;
        };
      };
      cacheKey: string | null;
      distance: number | null;
      distanceText: string;
      hasCoordinate: boolean;
    }> = [];
    try {
      computedDistanceItems = await getDistanceItemsFromCurrentLocation(currentLocation, customersToCompute.map(item => ({
        item,
        cacheKey: item.arKey,
        latitude: item.location.latitude,
        longitude: item.location.longitude
      })), vanCode);
      assertPipelineNotAborted(signal);
    } catch (error: any) {
      if (error?.code === 'LONGDO_API_KEY_MISSING' || error?.code === 'LONGDO_API_KEY_LIMIT_EXHAUSTED') {
        alertReason = error?.code === 'LONGDO_API_KEY_MISSING' ? 'missing' : 'limit';
        const sortedItems = listItems.map(item => ({
          ...item,
          distance: null,
          distanceText: alertReason === 'missing' ? 'ยังไม่ได้ตั้งค่า API Key' : 'API Key limit หมด'
        }));
        await mergeCustomerRouteLoadSession({
          cachedItems: sortedItems,
          totalLoaded: listItems.length,
          totalAvailable,
          hasMore,
          updatedAt: new Date().toISOString()
        });
        return {
          sortedItems,
          alertReason,
          recomputedCount: customersToCompute.length,
          cachedCount: Object.keys(cachedDistances).length
        };
      }
      console.log('[CustomerRoute] longdo unexpected error, fallback to straight line', {
        message: error?.message,
        status: error?.status,
        apiMessage: error?.apiMessage,
        customerCount: customersToCompute.length
      });
      computedDistanceItems = customersToCompute.map(item => {
        const distance = getDistanceBetweenCoordinates(currentLocation, {
          latitude: item.location.latitude,
          longitude: item.location.longitude
        });
        return {
          item,
          cacheKey: item.arKey,
          distance,
          distanceText: formatDistanceLabel(distance),
          hasCoordinate: true
        };
      });
    }
    computedDistanceItems.forEach(result => {
      const entry = {
        distance: result.distance,
        distanceText: result.distanceText
      };
      distanceEntriesByIndex[result.item.index] = entry;
      if (result.cacheKey) {
        cacheUpdates[result.cacheKey] = entry;
      }
    });
  }
  if (currentNumericPosition.latitude !== null && currentNumericPosition.longitude !== null) {
    await mergeCustomerRouteLoadSession({
      lastPosition: currentNumericPosition,
      updatedAt: new Date().toISOString()
    });
  }
  assertPipelineNotAborted(signal);
  if (canCompareDistance && !shouldReuseCachedDistances && currentNumericPosition.latitude !== null && currentNumericPosition.longitude !== null) {
    onSetLastPosition?.(currentNumericPosition);
  }
  const nextCustomers = listItems.map((item, index) => {
    const customerLocation = customerLocations[index];
    if (!hasCompleteCoordinate(customerLocation)) {
      return {
        ...item,
        distance: null,
        distanceText: 'ไม่มีข้อมูลพิกัด'
      };
    }
    if (!canCompareDistance) {
      return {
        ...item,
        distance: null,
        distanceText: 'ไม่พบตำแหน่งปัจจุบัน'
      };
    }
    const cachedOrComputedEntry = distanceEntriesByIndex[index];
    const distance = cachedOrComputedEntry?.distance ?? null;
    const distanceText = cachedOrComputedEntry?.distanceText ?? formatDistanceLabel(distance);
    return {
      ...item,
      distance,
      distanceText
    };
  });
  const sortedItems = sortCustomersByDistance(nextCustomers);
  if (Object.keys(cacheUpdates).length > 0) {
    await mergeCustomerRouteDistanceCache(cacheUpdates);
  }
  assertPipelineNotAborted(signal);
  await mergeCustomerRouteLoadSession({
    cachedItems: sortedItems,
    totalLoaded: listItems.length,
    totalAvailable,
    hasMore,
    updatedAt: new Date().toISOString()
  });
  return {
    sortedItems,
    alertReason,
    recomputedCount: customersToCompute.length,
    cachedCount: Object.keys(cachedDistances).length
  };
};