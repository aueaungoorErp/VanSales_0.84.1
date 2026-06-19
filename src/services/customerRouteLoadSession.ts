import { removeData, retrieveData, storeData } from '../utils/Storage';

const CUSTOMER_ROUTE_LOAD_SESSION_KEY = '@CustomerRouteLoadSession';

export type CustomerRouteLoadSession = {
  totalLoaded: number;
  hasMore: boolean;
  updatedAt: string;
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
        hasMore: parsedValue.hasMore === true,
        updatedAt: String(parsedValue.updatedAt || ''),
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

export const clearCustomerRouteLoadSession = async () => {
  try {
    await removeData(CUSTOMER_ROUTE_LOAD_SESSION_KEY);
    return true;
  } catch (error) {
    console.log('[CustomerRouteLoadSession] clear error', error);
    return false;
  }
};
