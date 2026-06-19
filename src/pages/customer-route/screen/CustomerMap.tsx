import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { MainTheme, mainContainer } from '../../../constant/lov';
import BackHandlerHOC from '../../../hoc/BackHandlerHOC';
import CustomerRouteList from '../component/CustomerRouteList';
import SearchForm from '../component/SearchForm';

type CustomerMapProps = {
  navigation?: unknown;
};

const CustomerMap: React.FC<CustomerMapProps> = props => {
  const [requestLoadMore, setRequestLoadMore] = useState<
    ((reset: boolean) => Promise<void>) | null
  >(null);
  const [isTimedLoading, setIsTimedLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'กำลังโหลดและคำนวณเส้นทาง',
  );
  const handleRegisterTimedLoadHandler = useCallback(
    (handler: (reset: boolean) => Promise<void>) => {
      setRequestLoadMore(() => handler);
    },
    [],
  );
  const handleTimedLoadingChange = useCallback((value: boolean) => {
    setIsTimedLoading(value);
  }, []);
  const handleLoadingMessageChange = useCallback((value: string) => {
    setLoadingMessage(value);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm
        {...props}
        onRegisterTimedLoadHandler={handleRegisterTimedLoadHandler}
        onLoadingMessageChange={handleLoadingMessageChange}
        onTimedLoadingChange={handleTimedLoadingChange}
      />
      <CustomerRouteList
        isTimedLoading={isTimedLoading}
        loadingMessage={loadingMessage}
        onLoadingMessageChange={handleLoadingMessageChange}
        onRequestTimedLoad={requestLoadMore}
      />
    </View>
  );
};

export default BackHandlerHOC(CustomerMap);

const styles = StyleSheet.create({
  container: mainContainer as ViewStyle,
  containerStyle: {
    width: '100%',
    height: 40,
    borderRadius: 6,
    borderColor: MainTheme.colorPrimary,
  },
  buttonStyle: {
    backgroundColor: MainTheme.colorSecondary,
  },
});
