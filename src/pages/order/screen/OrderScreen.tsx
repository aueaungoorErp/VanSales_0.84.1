import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { MainTheme, mainContainer } from '../../../constant/lov';
import BackHandlerHOC from '../../../hoc/BackHandlerHOC';
import CustomerList from '../../customer/presenter/ListItems';
import SearchForm from '../../customer/presenter/SearchForm';

type OrderScreenProps = {
  navigation?: unknown;
};

const OrderScreen: React.FC<OrderScreenProps> = props => {
  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm {...props} />
      <CustomerList />
    </View>
  );
};

export default BackHandlerHOC(OrderScreen);

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
