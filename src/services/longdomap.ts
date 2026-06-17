import getDistance from 'geolib/es/getDistance';
import {
  getLongdoMapApiKeyConfigs,
  setLongdoMapApiKeyConfigs,
} from '../utils/Token';
import { removeData, retrieveData, storeData } from '../utils/Storage';

type CoordinateValue = string | number | null | undefined;

type Coordinate = {
  latitude: CoordinateValue;
  longitude: CoordinateValue;
};

type NumericCoordinate = {
  latitude: number;
  longitude: number;
};

type DistanceCacheEntry = {
  distance: number | null;
  distanceText: string;
};

type DistanceCacheMap = Record<string, DistanceCacheEntry>;

const LONGDO_ROUTE_MATRIX_ENDPOINT =
  'https://api.longdo.com/RouteService/json/route/matrix';
const LONGDO_ROUTE_GUIDE_ENDPOINT =
  'https://api.longdo.com/RouteService/json/route/guide';
const LONGDO_ROUTE_BATCH_SIZE = 25;
const LONGDO_ROUTE_MODE = 'd';
const LONGDO_ROUTE_TYPE = '1';
const CUSTOMER_ROUTE_DISTANCE_CACHE_KEY = '@CustomerRouteDistanceCache';

type LongdoApiKeyTestStatus = 'success' | 'limit' | 'invalid' | 'error';

export type LongdoApiKeyTestResult = {
  key: string;
  status: LongdoApiKeyTestStatus;
  httpStatus: number | null;
  message: string;
};

type LongdoApiKeyConfig = {
  key: string;
  outoflimit: boolean;
};

type LongdoApiKeyAvailability =
  | { ok: true; configs: LongdoApiKeyConfig[] }
  | { ok: false; reason: 'missing' | 'limit' };

const toNumber = (value: CoordinateValue): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const hasCompleteCoordinate = (coordinate?: Coordinate | null) => {
  if (!coordinate) {
    return false;
  }

  return (
    toNumber(coordinate.latitude) !== null &&
    toNumber(coordinate.longitude) !== null
  );
};

const toNumericCoordinate = (
  coordinate?: Coordinate | null,
): NumericCoordinate | null => {
  if (!coordinate) {
    return null;
  }

  const latitude = toNumber(coordinate.latitude);
  const longitude = toNumber(coordinate.longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return { latitude, longitude };
};

export const parseCoordinate = (value: CoordinateValue): number | null =>
  toNumber(value);

const getStraightLineDistance = (
  currentLocation?: Coordinate | null,
  customerLocation?: Coordinate | null,
): number | null => {
  const currentCoordinate = toNumericCoordinate(currentLocation);
  const customerCoordinate = toNumericCoordinate(customerLocation);

  if (!currentCoordinate || !customerCoordinate) {
    return null;
  }

  return getDistance(
    currentCoordinate,
    customerCoordinate,
    0.01,
  );
};

export const getDistanceBetweenCoordinates = (
  startLocation?: Coordinate | null,
  endLocation?: Coordinate | null,
): number | null => getStraightLineDistance(startLocation, endLocation);

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const buildQueryString = (pairs: Array<[string, string]>) =>
  pairs
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

const isLongdoLimitStatus = (status?: number | null) =>
  status === 409 || status === 429;

const isLongdoInvalidKeyStatus = (status?: number | null) =>
  status === 401 || status === 403;

const isLongdoInvalidKeyMessage = (message?: string | null) => {
  const normalizedMessage = String(message ?? '').trim().toLowerCase();

  if (!normalizedMessage) {
    return false;
  }

  return (
    normalizedMessage.includes('invalid key') ||
    normalizedMessage.includes('invalid api key') ||
    normalizedMessage.includes('api key invalid') ||
    normalizedMessage.includes('key invalid') ||
    normalizedMessage.includes('unauthorized') ||
    normalizedMessage.includes('forbidden')
  );
};

const buildLongdoRouteMatrixUrl = (
  currentLocation: NumericCoordinate,
  customerLocations: NumericCoordinate[],
  apiKey: string,
) => {
  const queryPairs: Array<[string, string]> = [
    ['flat', `${currentLocation.latitude}`],
    ['flon', `${currentLocation.longitude}`],
    ['mode', LONGDO_ROUTE_MODE],
    ['type', LONGDO_ROUTE_TYPE],
    ['locale', 'th'],
    ['key', apiKey],
  ];

  customerLocations.forEach(location => {
    queryPairs.push(['tlat', `${location.latitude}`]);
    queryPairs.push(['tlon', `${location.longitude}`]);
  });

  return `${LONGDO_ROUTE_MATRIX_ENDPOINT}?${buildQueryString(queryPairs)}`;
};

const buildLongdoRouteGuideUrl = (
  startLocation: NumericCoordinate,
  endLocation: NumericCoordinate,
  apiKey: string,
) => {
  const queryPairs: Array<[string, string]> = [
    ['flat', `${startLocation.latitude}`],
    ['flon', `${startLocation.longitude}`],
    ['tlat', `${endLocation.latitude}`],
    ['tlon', `${endLocation.longitude}`],
    ['mode', 't'],
    ['type', '25'],
    ['locale', 'th'],
    ['key', apiKey],
  ];

  return `${LONGDO_ROUTE_GUIDE_ENDPOINT}?${buildQueryString(queryPairs)}`;
};

const getConfiguredLongdoMapApiKeys = async (vanCode?: string | null) => {
  const storedConfigs = await (getLongdoMapApiKeyConfigs as any)(
    vanCode ?? null,
  );

  return storedConfigs
    .map((item: any): LongdoApiKeyConfig => ({
      key: String(item?.key ?? '').trim(),
      outoflimit: Boolean(item?.outoflimit),
    }))
    .filter((item: LongdoApiKeyConfig) => item.key !== '');
};

const fetchRouteMatrixDistancesWithKey = async (
  currentLocation: NumericCoordinate,
  customerLocations: NumericCoordinate[],
  apiKey: string,
): Promise<Array<number | null>> => {
  const response = await fetch(buildLongdoRouteMatrixUrl(
    currentLocation,
    customerLocations,
    apiKey,
  ));
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(`Longdo route matrix HTTP ${response.status}`) as Error & {
      status?: number;
      apiMessage?: string | null;
    };
    error.status = response.status;
    error.apiMessage =
      typeof payload?.meta?.message === 'string'
        ? payload.meta.message
        : typeof payload?.message === 'string'
          ? payload.message
          : null;
    throw error;
  }

  if (payload?.meta?.status && payload.meta.status >= 400) {
    const error = new Error(
      payload.meta.message || 'Longdo route matrix failed',
    ) as Error & { status?: number; apiMessage?: string | null };
    error.status = payload.meta.status;
    error.apiMessage =
      typeof payload?.meta?.message === 'string' ? payload.meta.message : null;
    throw error;
  }

  const matrixRow = Array.isArray(payload?.data) ? payload.data[0] : null;

  if (!Array.isArray(matrixRow)) {
    throw new Error('Longdo route matrix returned invalid data');
  }

  return customerLocations.map((_, index) => {
    const distance = matrixRow[index]?.distance;
    return typeof distance === 'number' && Number.isFinite(distance)
      ? distance
      : null;
  });
};

const fetchRouteGuideDistanceWithKey = async (
  startLocation: NumericCoordinate,
  endLocation: NumericCoordinate,
  apiKey: string,
): Promise<number> => {
  const response = await fetch(
    buildLongdoRouteGuideUrl(startLocation, endLocation, apiKey),
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(`Longdo route guide HTTP ${response.status}`) as Error & {
      status?: number;
      apiMessage?: string | null;
    };
    error.status = response.status;
    error.apiMessage =
      typeof payload?.meta?.message === 'string'
        ? payload.meta.message
        : typeof payload?.message === 'string'
          ? payload.message
          : null;
    throw error;
  }

  if (payload?.meta?.status && payload.meta.status >= 400) {
    const error = new Error(
      payload.meta.message || 'Longdo route guide failed',
    ) as Error & { status?: number; apiMessage?: string | null };
    error.status = payload.meta.status;
    error.apiMessage =
      typeof payload?.meta?.message === 'string' ? payload.meta.message : null;
    throw error;
  }

  const routeItem = Array.isArray(payload?.data) ? payload.data[0] : null;
  const distanceCandidates = [
    routeItem?.distance,
    routeItem?.tdistance,
    routeItem?.fdistance,
  ];
  const distance = distanceCandidates.find(
    item => typeof item === 'number' && Number.isFinite(item),
  );

  if (typeof distance !== 'number') {
    throw new Error('Longdo route guide returned invalid distance');
  }

  return distance;
};

const fetchRouteMatrixDistances = async (
  currentLocation: NumericCoordinate,
  customerLocations: NumericCoordinate[],
  vanCode?: string | null,
): Promise<Array<number | null>> => {
  const apiKeyConfigs = await getConfiguredLongdoMapApiKeys(vanCode);
  let lastError: any = null;
  let hasLimitError = false;

  for (let index = 0; index < apiKeyConfigs.length; index += 1) {
    const apiKeyConfig = apiKeyConfigs[index];
    if (apiKeyConfig.outoflimit) {
      continue;
    }

    try {
      return await fetchRouteMatrixDistancesWithKey(
        currentLocation,
        customerLocations,
        apiKeyConfig.key,
      );
    } catch (error: any) {
      lastError = error;

      if (isLongdoLimitStatus(error?.status)) {
        hasLimitError = true;
        const nextConfigs = apiKeyConfigs.map((item: LongdoApiKeyConfig, itemIndex: number) =>
          itemIndex === index
            ? {
                ...item,
                outoflimit: true,
              }
            : item,
        );
        await (setLongdoMapApiKeyConfigs as any)(nextConfigs, vanCode ?? null);
        continue;
      }

      continue;
    }
  }

  if (apiKeyConfigs.length === 0) {
    const error = new Error('LONGDO_API_KEY_MISSING') as Error & {
      code?: string;
    };
    error.code = 'LONGDO_API_KEY_MISSING';
    throw error;
  }

  if (hasLimitError) {
    const error = new Error('LONGDO_API_KEY_LIMIT_EXHAUSTED') as Error & {
      code?: string;
    };
    error.code = 'LONGDO_API_KEY_LIMIT_EXHAUSTED';
    throw error;
  }

  throw lastError || new Error('Longdo route matrix failed');
};

export const assessLongdoApiKeyAvailability = async (
  vanCode?: string | null,
): Promise<LongdoApiKeyAvailability> => {
  const configs = await getConfiguredLongdoMapApiKeys(vanCode);

  if (configs.length === 0) {
    return {
      ok: false,
      reason: 'missing',
    };
  }

  if (configs.some((item: LongdoApiKeyConfig) => !item.outoflimit)) {
    return {
      ok: true,
      configs,
    };
  }

  return {
    ok: false,
    reason: 'limit',
  };
};

export const getLongdoApiKeyAlertMessage = (reason: 'missing' | 'limit') => {
  if (reason === 'missing') {
    return 'ไม่มี API Key รบกวนไปตั้งค่า API Key ก่อน';
  }

  return 'Longdo API Key limit หมดแล้ว';
};

export const testLongdoMapApiKey = async (
  apiKey: string,
): Promise<LongdoApiKeyTestResult> => {
  const key = apiKey.trim();
  const startLocation = { latitude: 13.743080902938331, longitude: 100.54898053407669 };
  const endLocation = { latitude: 13.724314618267575, longitude: 100.55885508656502 };

  if (!key) {
    return {
      key,
      status: 'invalid',
      httpStatus: null,
      message: 'กรุณาระบุ Longdo Map API Key',
    };
  }

  try {
    await fetchRouteGuideDistanceWithKey(startLocation, endLocation, key);

    return {
      key,
      status: 'success',
      httpStatus: 200,
      message: 'ใช้งานได้',
    };
  } catch (error: any) {
    const status = error?.status ?? null;
    const apiMessage = String(
      error?.apiMessage ?? error?.message ?? '',
    ).trim();

    if (isLongdoLimitStatus(status)) {
      return {
        key,
        status: 'limit',
        httpStatus: status,
        message: `API Key ใช้งานครบ limit แล้ว (${status})`,
      };
    }

    if (isLongdoInvalidKeyStatus(status) || isLongdoInvalidKeyMessage(apiMessage)) {
      return {
        key,
        status: 'invalid',
        httpStatus: status,
        message: 'API Key ไม่ถูกต้อง',
      };
    }

    return {
      key,
      status: 'error',
      httpStatus: status,
      message: apiMessage || 'ไม่สามารถตรวจสอบ API Key ได้',
    };
  }
};

export const getDistancesFromCurrentLocation = async (
  currentLocation?: Coordinate | null,
  customerLocations: Array<Coordinate | null | undefined> = [],
  vanCode?: string | null,
): Promise<Array<number | null>> => {
  const currentCoordinate = toNumericCoordinate(currentLocation);

  if (!currentCoordinate) {
    return customerLocations.map(() => null);
  }

  const results: Array<number | null> = customerLocations.map(location =>
    hasCompleteCoordinate(location) ? 0 : null,
  );
  const validLocations = customerLocations
    .map((location, index) => ({
      index,
      coordinate: toNumericCoordinate(location),
    }))
    .filter(
      (
        item,
      ): item is {
        index: number;
        coordinate: NumericCoordinate;
      } => item.coordinate !== null,
    );

  const locationChunks = chunkArray(validLocations, LONGDO_ROUTE_BATCH_SIZE);

  for (const locationChunk of locationChunks) {
    try {
      console.log('[longdomap] route matrix request', {
        destinations: locationChunk.length,
        mode: LONGDO_ROUTE_MODE,
        type: LONGDO_ROUTE_TYPE,
      });

      const distances = await fetchRouteMatrixDistances(
        currentCoordinate,
        locationChunk.map(item => item.coordinate),
        vanCode,
      );

      locationChunk.forEach((item, index) => {
        results[item.index] =
          distances[index] ??
          getStraightLineDistance(currentCoordinate, item.coordinate);
      });
    } catch (error: any) {
      if (
        error?.code === 'LONGDO_API_KEY_MISSING' ||
        error?.code === 'LONGDO_API_KEY_LIMIT_EXHAUSTED'
      ) {
        throw error;
      }

      console.log('[longdomap] route matrix error, fallback to straight line', {
        message: error?.message || error,
        destinations: locationChunk.length,
      });

      locationChunk.forEach(item => {
        results[item.index] = getStraightLineDistance(
          currentCoordinate,
          item.coordinate,
        );
      });
    }
  }

  return results;
};

export const getCustomerRouteDistanceCache =
  async (): Promise<DistanceCacheMap> => {
    try {
      const rawCache = await retrieveData(CUSTOMER_ROUTE_DISTANCE_CACHE_KEY);

      if (!rawCache) {
        return {};
      }

      const parsedCache = JSON.parse(rawCache);

      return parsedCache && typeof parsedCache === 'object' ? parsedCache : {};
    } catch (error) {
      console.log('[longdomap] read cache error', error);
      return {};
    }
  };

export const mergeCustomerRouteDistanceCache = async (
  entries: DistanceCacheMap,
): Promise<DistanceCacheMap> => {
  try {
    const currentCache = await getCustomerRouteDistanceCache();
    const nextCache = {
      ...currentCache,
      ...entries,
    };

    await storeData(
      CUSTOMER_ROUTE_DISTANCE_CACHE_KEY,
      JSON.stringify(nextCache),
    );

    return nextCache;
  } catch (error) {
    console.log('[longdomap] write cache error', error);
    return {};
  }
};

export const clearCustomerRouteDistanceCache = async () => {
  try {
    await removeData(CUSTOMER_ROUTE_DISTANCE_CACHE_KEY);
    return true;
  } catch (error) {
    console.log('[longdomap] clear cache error', error);
    return false;
  }
};

export const getDistanceFromCurrentLocation = async (
  currentLocation?: Coordinate | null,
  customerLocation?: Coordinate | null,
  vanCode?: string | null,
): Promise<number | null> => {
  const distances = await getDistancesFromCurrentLocation(currentLocation, [
    customerLocation,
  ], vanCode);

  return distances[0] ?? null;
};

export const formatDistanceLabel = (distance: number | null) => {
  if (distance === null) {
    return 'ไม่มีข้อมูลพิกัด';
  }

  if (distance < 1000) {
    return `${distance.toLocaleString('th-TH')} ม.`;
  }

  return `${(distance / 1000).toFixed(2)} กม.`;
};

export const isWithinDistanceThreshold = (
  startLocation?: Coordinate | null,
  endLocation?: Coordinate | null,
  thresholdInMeters = 15,
) => {
  const distance = getDistanceBetweenCoordinates(startLocation, endLocation);

  return distance !== null && distance <= thresholdInMeters;
};
