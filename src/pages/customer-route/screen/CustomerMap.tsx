import React from 'react';
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
  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm {...props} />
      <CustomerRouteList />
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
