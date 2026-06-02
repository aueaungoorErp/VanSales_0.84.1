import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mainContainer } from '../../../constant/lov';
import SearchForm from '../presenter/SearchForm';
import ListItems from '../presenter/ListItems';

const Form = props => {
  return (
    <View style={styles.container}>
      <SearchForm screen={'profile'} />
      <ListItems screen={'profile'} />
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: mainContainer,
});
