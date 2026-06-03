import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mainContainer } from '../../../constant/lov';
import SearchForm from '../presenter/SearchForm';
import { CustomerList } from '../../order/component/CustomerList';

const Form = props => {
  return (
    <View style={styles.container}>
      <SearchForm screen={'profile'} />
      <CustomerList screen={'profile'} />
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: mainContainer,
});
