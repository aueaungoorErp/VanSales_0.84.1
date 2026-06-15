import getDistance from 'geolib/es/getDistance';
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

const LONGDO_MAP_API_KEY = '99909e86e22ebae524f0d60743c38dda';
const LONGDO_ROUTE_MATRIX_ENDPOINT =
  'https://api.longdo.com/RouteService/json/route/matrix';
const LONGDO_ROUTE_BATCH_SIZE = 25;
const LONGDO_ROUTE_MODE = 'd';
const LONGDO_ROUTE_TYPE = '1';
const CUSTOMER_ROUTE_DISTANCE_CACHE_KEY = '@CustomerRouteDistanceCache';

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

const fetchRouteMatrixDistances = async (
  currentLocation: NumericCoordinate,
  customerLocations: NumericCoordinate[],
): Promise<Array<number | null>> => {
  const queryPairs: Array<[string, string]> = [
    ['flat', `${currentLocation.latitude}`],
    ['flon', `${currentLocation.longitude}`],
    ['mode', LONGDO_ROUTE_MODE],
    ['type', LONGDO_ROUTE_TYPE],
    ['locale', 'th'],
    ['key', LONGDO_MAP_API_KEY],
  ];

  customerLocations.forEach(location => {
    queryPairs.push(['tlat', `${location.latitude}`]);
    queryPairs.push(['tlon', `${location.longitude}`]);
  });

  const response = await fetch(
    `${LONGDO_ROUTE_MATRIX_ENDPOINT}?${buildQueryString(queryPairs)}`,
  );
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Longdo route matrix HTTP ${response.status}`,
    );
  }

  if (payload?.meta?.status && payload.meta.status >= 400) {
    throw new Error(payload.meta.message || 'Longdo route matrix failed');
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

export const getDistancesFromCurrentLocation = async (
  currentLocation?: Coordinate | null,
  customerLocations: Array<Coordinate | null | undefined> = [],
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
      );

      locationChunk.forEach((item, index) => {
        results[item.index] =
          distances[index] ??
          getStraightLineDistance(currentCoordinate, item.coordinate);
      });
    } catch (error: any) {
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
): Promise<number | null> => {
  const distances = await getDistancesFromCurrentLocation(currentLocation, [
    customerLocation,
  ]);

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
