import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mainContainer } from '../../../constant/lov';
import SearchForm from '../presenter/SearchForm';
import CTListItems from '../container/CTListItems';

const Form = props => {
  return (
    <View style={styles.container}>
      <SearchForm screen={'profile'} />
      <CTListItems screen={'profile'} />
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: mainContainer,
});
