import React from 'react';
import {StyleSheet, View} from 'react-native';

import CTListItems from '../../container/CTListItems';
import SalespersonSalesPerformanceSearchContainer from '../component/SalespersonSalesPerformanceSearchContainer';

const SalespersonSalesPerformanceScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <SalespersonSalesPerformanceSearchContainer />
      </View>
      <View style={styles.listSection}>
        <CTListItems />
      </View>
    </View>
  );
};

export default SalespersonSalesPerformanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F4F8F5',
  },
  searchSection: {
    zIndex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listSection: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
