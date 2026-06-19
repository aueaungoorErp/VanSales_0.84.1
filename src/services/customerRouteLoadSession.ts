import { removeData, retrieveData, storeData } from '../utils/Storage';

const CUSTOMER_ROUTE_LOAD_SESSION_KEY = '@CustomerRouteLoadSession';

type CachedPosition = {
  latitude: number | null;
  longitude: number | null;
};

const toNumberOrNull = (value: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export type CustomerRouteLoadSession = {
  totalLoaded: number;
  totalAvailable: number;
  hasMore: boolean;
  updatedAt: string;
  cachedItems: any[];
  lastPosition: CachedPosition;
  keyword: string | null;
  arcatKey: string | null;
  nextOffset: number;
  limit: number;
};

export const getCustomerRouteLoadSession =
  async (): Promise<CustomerRouteLoadSession | null> => {
    try {
      const rawValue = await retrieveData(CUSTOMER_ROUTE_LOAD_SESSION_KEY);

      if (!rawValue) {
        return null;
      }

      const parsedValue = JSON.parse(rawValue);

      if (!parsedValue || typeof parsedValue !== 'object') {
        return null;
      }

      return {
        totalLoaded: Number(parsedValue.totalLoaded) || 0,
        totalAvailable: Number(parsedValue.totalAvailable) || 0,
        hasMore: parsedValue.hasMore === true,
        updatedAt: String(parsedValue.updatedAt || ''),
        cachedItems: Array.isArray(parsedValue.cachedItems)
          ? parsedValue.cachedItems
          : [],
        lastPosition: {
          latitude: toNumberOrNull(parsedValue?.lastPosition?.latitude),
          longitude: toNumberOrNull(parsedValue?.lastPosition?.longitude),
        },
        keyword:
          parsedValue.keyword === null || typeof parsedValue.keyword === 'string'
            ? parsedValue.keyword
            : null,
        arcatKey:
          parsedValue.arcatKey === null ||
          typeof parsedValue.arcatKey === 'string'
            ? parsedValue.arcatKey
            : null,
        nextOffset: Number(parsedValue.nextOffset) || 1,
        limit: Number(parsedValue.limit) || 20,
      };
    } catch (error) {
      console.log('[CustomerRouteLoadSession] read error', error);
      return null;
    }
  };

export const setCustomerRouteLoadSession = async (
  session: CustomerRouteLoadSession,
) => {
  try {
    await storeData(CUSTOMER_ROUTE_LOAD_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.log('[CustomerRouteLoadSession] write error', error);
    return false;
  }
};

export const mergeCustomerRouteLoadSession = async (
  sessionPatch: Partial<CustomerRouteLoadSession>,
) => {
  try {
    const currentSession = await getCustomerRouteLoadSession();
    const baseSession: CustomerRouteLoadSession = {
      totalLoaded: 0,
      totalAvailable: 0,
      hasMore: false,
      updatedAt: '',
      cachedItems: [],
      lastPosition: {
        latitude: null,
        longitude: null,
      },
      keyword: null,
      arcatKey: null,
      nextOffset: 1,
      limit: 20,
    };

    const nextSession: CustomerRouteLoadSession = {
      ...baseSession,
      ...(currentSession ?? {}),
      ...sessionPatch,
      lastPosition: {
        latitude:
          sessionPatch.lastPosition?.latitude ??
          currentSession?.lastPosition?.latitude ??
          null,
        longitude:
          sessionPatch.lastPosition?.longitude ??
          currentSession?.lastPosition?.longitude ??
          null,
      },
    };

    await storeData(CUSTOMER_ROUTE_LOAD_SESSION_KEY, JSON.stringify(nextSession));
    return true;
  } catch (error) {
    console.log('[CustomerRouteLoadSession] merge error', error);
    return false;
  }
};

export const clearCustomerRouteLoadSession = async () => {
  try {
    await removeData(CUSTOMER_ROUTE_LOAD_SESSION_KEY);
    return true;
  } catch (error) {
    console.log('[CustomerRouteLoadSession] clear error', error);
    return false;
  }
};
