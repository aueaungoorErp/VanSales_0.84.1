import getDistance from 'geolib/es/getDistance';

type CoordinateValue = string | number | null | undefined;

type Coordinate = {
  latitude: CoordinateValue;
  longitude: CoordinateValue;
};

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

export const getDistanceFromCurrentLocation = async (
  currentLocation?: Coordinate | null,
  customerLocation?: Coordinate | null,
): Promise<number | null> => {
  if (
    !hasCompleteCoordinate(currentLocation) ||
    !hasCompleteCoordinate(customerLocation)
  ) {
    return null;
  }

  const currentLatitude = toNumber(currentLocation?.latitude);
  const currentLongitude = toNumber(currentLocation?.longitude);
  const customerLatitude = toNumber(customerLocation?.latitude);
  const customerLongitude = toNumber(customerLocation?.longitude);

  if (
    currentLatitude === null ||
    currentLongitude === null ||
    customerLatitude === null ||
    customerLongitude === null
  ) {
    return null;
  }

  return getDistance(
    { latitude: currentLatitude, longitude: currentLongitude },
    { latitude: customerLatitude, longitude: customerLongitude },
    0.01,
  );
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
