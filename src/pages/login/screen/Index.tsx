import React from 'react';
import { StyleSheet, View } from 'react-native';
import CTForm from '../container/CTForm';
import { MainTheme } from '../../../constant/lov';

type IndexProps = {
  navigation?: unknown;
};

const Index: React.FC<IndexProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CTForm navigation={navigation} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
  },
});