import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { MainTheme, mainContainer } from '../../../constant/lov';
import BackHandlerHOC from '../../../hoc/BackHandlerHOC';
import CTListItems from '../../customer/container/CTListItems';
import SearchForm from '../../customer/presenter/SearchForm';

type OrderScreenProps = {
  navigation?: unknown;
};

const Index: React.FC<OrderScreenProps> = props => {
  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm {...props} />
      <CTListItems />
    </View>
  );
};

export default BackHandlerHOC(Index);

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
