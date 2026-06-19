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
  const handleRegisterTimedLoadHandler = useCallback(
    (handler: (reset: boolean) => Promise<void>) => {
      setRequestLoadMore(() => handler);
    },
    [],
  );

  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm
        {...props}
        onRegisterTimedLoadHandler={handleRegisterTimedLoadHandler}
      />
      <CustomerRouteList onRequestTimedLoad={requestLoadMore} />
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
