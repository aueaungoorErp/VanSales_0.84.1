import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mainContainer } from '../../../constant/lov';
import CTDetail from '../../customer/container/CTDetail';
import CTChoiceGroup from '../container/CTChoiceGroup';
import type { ViewStyle } from 'react-native';

type OrderChoiceScreenProps = {
  navigation?: unknown;
};

const OrderChoiceScreen: React.FC<OrderChoiceScreenProps> = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.3 }}>
        <CTDetail />
      </View>
      <View style={{ flex: 0.7 }}>
        <CTChoiceGroup />
      </View>
    </View>
  );
};

export default OrderChoiceScreen;

const styles = StyleSheet.create({
  container: mainContainer as ViewStyle,
});
