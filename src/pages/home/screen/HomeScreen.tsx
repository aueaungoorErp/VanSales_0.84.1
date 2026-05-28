import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MainTheme } from '../../../constant/lov';
import CTHeader from '../../user/container/CTHeader';
import CTMenuItems from '../component/CTMenuItems';

type HomeScreenProps = {
  navigation?: unknown;
};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CTHeader />
      </View>
      <View style={styles.body}>
        <CTMenuItems />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
  },
  header: {
    flex: 0.3,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorQuinary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 0.7,
  },
});
