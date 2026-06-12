import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { getCurrentPosition } from '../../../action/geolocation';
import { MainTheme, mainContainer } from '../../../constant/lov';
import BackHandlerHOC from '../../../hoc/BackHandlerHOC';
import {
  formatDistanceLabel,
  getDistanceFromCurrentLocation,
  hasCompleteCoordinate,
} from '../../../services/longdomap';
import type { CustomerItem } from '../../order/interface';

type GeolocationState = {
  position: {
    latitude: string | null;
    longitude: string | null;
  };
};

type RouteCustomer = CustomerItem & {
  distance?: number | null;
  distanceText?: string;
};

type CustomerMapDetailProps = {
  geolocation: GeolocationState;
  getCurrentPosition: () => Promise<any>;
  route?: {
    params?: {
      customer?: RouteCustomer;
    };
  };
};

const parseCoordinate = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : parseFloat(`${value}`);

  return Number.isFinite(parsed) ? parsed : null;
};

const buildAddress = (customer?: RouteCustomer) => {
  if (!customer) {
    return '-';
  }

  const addressParts = [
    customer.ADDB_ADDB_1,
    customer.ADDB_ADDB_2,
    customer.ADDB_ADDB_3,
    customer.ADDB_SUB_DISTRICT,
    customer.ADDB_DISTRICT,
    customer.ADDB_PROVINCE,
    customer.ADDB_POST,
  ].filter(Boolean);

  return addressParts.length > 0 ? addressParts.join(' ') : '-';
};

const CustomerMapDetailBase: React.FC<CustomerMapDetailProps> = ({
  geolocation,
  getCurrentPosition,
  route,
}) => {
  const customer = route?.params?.customer;
  const [isLoading, setIsLoading] = useState(false);
  const [distanceText, setDistanceText] = useState(
    customer?.distanceText ?? 'กำลังคำนวณระยะทาง',
  );

  const customerCoordinate = useMemo(
    () => ({
      latitude: parseCoordinate(customer?.ADDB_GPS_LAT_S),
      longitude: parseCoordinate(customer?.ADDB_GPS_LONG_S),
    }),
    [customer],
  );

  const currentCoordinate = useMemo(
    () => ({
      latitude: parseCoordinate(geolocation.position.latitude),
      longitude: parseCoordinate(geolocation.position.longitude),
    }),
    [geolocation.position.latitude, geolocation.position.longitude],
  );

  const directionsUrl = useMemo(() => {
    if (!hasCompleteCoordinate(customerCoordinate)) {
      return null;
    }

    const destination = `${customerCoordinate.latitude},${customerCoordinate.longitude}`;
    const webOriginQuery = hasCompleteCoordinate(currentCoordinate)
      ? `&origin=${currentCoordinate.latitude},${currentCoordinate.longitude}`
      : '';

    return `https://www.google.com/maps/dir/?api=1${webOriginQuery}&destination=${destination}&travelmode=driving`;
  }, [currentCoordinate, customerCoordinate]);

  useEffect(() => {
    let isMounted = true;

    const prepareMap = async () => {
      setIsLoading(true);

      if (!hasCompleteCoordinate(currentCoordinate)) {
        try {
          await getCurrentPosition();
        } catch (error) {
          console.log('[CustomerMapDetail] getCurrentPosition error', error);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    void prepareMap();

    return () => {
      isMounted = false;
    };
  }, [currentCoordinate, getCurrentPosition]);

  useEffect(() => {
    let isMounted = true;

    const updateDistance = async () => {
      if (!hasCompleteCoordinate(customerCoordinate)) {
        if (isMounted) {
          setDistanceText('ไม่มีข้อมูลพิกัดลูกค้า');
        }
        return;
      }

      if (!hasCompleteCoordinate(currentCoordinate)) {
        if (isMounted) {
          setDistanceText('ไม่พบตำแหน่งปัจจุบัน');
        }
        return;
      }

      const distance = await getDistanceFromCurrentLocation(
        currentCoordinate,
        customerCoordinate,
      );

      if (isMounted) {
        setDistanceText(formatDistanceLabel(distance));
      }
    };

    void updateDistance();

    return () => {
      isMounted = false;
    };
  }, [currentCoordinate, customerCoordinate]);

  const openGoogleMaps = async () => {
    if (!hasCompleteCoordinate(customerCoordinate)) {
      return;
    }

    const destination = `${customerCoordinate.latitude},${customerCoordinate.longitude}`;
    const fallbackUrl =
      directionsUrl ??
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    const candidateUrls =
      Platform.OS === 'android'
        ? [
            `google.navigation:q=${destination}&mode=d`,
            `geo:0,0?q=${destination}`,
            fallbackUrl,
          ]
        : [
            `comgooglemaps://?daddr=${destination}&directionsmode=driving`,
            fallbackUrl,
          ];

    for (const url of candidateUrls) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return;
        }
      } catch (error) {
        console.log('[CustomerMapDetail] open map error', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapSection}>
        {directionsUrl ? (
          <WebView
            source={{ uri: directionsUrl }}
            style={styles.map}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            setSupportMultipleWindows={false}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <Text style={styles.webViewLoadingText} allowFontScaling={false}>
                  กำลังโหลดเส้นทาง
                </Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.mapFallback}>
            <AntDesign
              name="environment"
              size={34}
              color={MainTheme.colorPrimary}
            />
            <Text style={styles.mapFallbackTitle} allowFontScaling={false}>
              ไม่มีข้อมูลเส้นทาง
            </Text>
            <Text style={styles.mapFallbackText} allowFontScaling={false}>
              ตรวจสอบพิกัดลูกค้าและตำแหน่งปัจจุบันอีกครั้ง
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.detailSection}
        contentContainerStyle={styles.detailContent}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.codeText} allowFontScaling={false}>
                {customer?.AR_CODE || '-'}
              </Text>
              <Text style={styles.nameText} allowFontScaling={false}>
                {customer?.AR_NAME || customer?.ADDB_COMPANY || '-'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.mapButton,
                !hasCompleteCoordinate(customerCoordinate) &&
                  styles.mapButtonDisabled,
              ]}
              onPress={() => {
                void openGoogleMaps();
              }}
              disabled={!hasCompleteCoordinate(customerCoordinate)}
            >
              <AntDesign name="environment" size={18} color="#FFFFFF" />
              <Text style={styles.mapButtonText} allowFontScaling={false}>
                นำทาง
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.labelText} allowFontScaling={false}>
              ระยะทาง
            </Text>
            <Text style={styles.valueHighlightText} allowFontScaling={false}>
              {distanceText}
            </Text>
          </View>

          <View style={styles.infoRowBlock}>
            <Text style={styles.labelText} allowFontScaling={false}>
              ที่อยู่
            </Text>
            <Text style={styles.valueText} allowFontScaling={false}>
              {buildAddress(customer)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {isLoading ? (
        <View style={styles.screenLoadingOverlay}>
          <View style={styles.screenLoadingCard}>
            <Text style={styles.screenLoadingText} allowFontScaling={false}>
              กำลังโหลดแผนที่ลูกค้า
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  geolocation: state.geolocation,
});

const mapDispatchToProps = (dispatch: any) => ({
  getCurrentPosition: () => dispatch(getCurrentPosition()),
});

export default BackHandlerHOC(
  connect(mapStateToProps, mapDispatchToProps)(CustomerMapDetailBase),
);

const styles = StyleSheet.create({
  container: {
    ...(mainContainer as object),
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  mapSection: {
    flex: 0.48,
    minHeight: 280,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  webViewLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  webViewLoadingText: {
    fontSize: hp('1.8%'),
    color: '#6A7480',
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  mapFallbackTitle: {
    marginTop: 12,
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#1E2A36',
  },
  mapFallbackText: {
    marginTop: 8,
    fontSize: hp('1.7%'),
    color: '#6A7480',
    textAlign: 'center',
  },
  detailSection: {
    flex: 0.52,
  },
  detailContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  mapButton: {
    minWidth: 92,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MainTheme.colorPrimary,
  },
  mapButtonDisabled: {
    backgroundColor: '#B8C2CC',
  },
  mapButtonText: {
    fontSize: hp('1.7%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  codeText: {
    fontSize: hp('1.8%'),
    color: '#6A7480',
    marginBottom: 4,
  },
  nameText: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#1E2A36',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F5',
  },
  infoRowBlock: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F5',
  },
  labelText: {
    fontSize: hp('1.75%'),
    color: '#6A7480',
    marginBottom: 6,
  },
  valueText: {
    fontSize: hp('1.85%'),
    color: '#1E2A36',
  },
  valueHighlightText: {
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    color: MainTheme.colorPrimary,
  },
  screenLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  screenLoadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  screenLoadingText: {
    fontSize: hp('1.8%'),
    color: '#1E2A36',
  },
});
