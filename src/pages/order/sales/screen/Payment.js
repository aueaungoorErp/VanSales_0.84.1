import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mainContainer } from '../../../../constant/lov';
import CTPaymentForm from '../container/CTPaymentForm';

const Payment = props => {
  const { route } = props;
  const { processResult } = route.params;
  return (
    <View style={styles.container}>
      <CTPaymentForm processResult={processResult} />
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: mainContainer,
});
