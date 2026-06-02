import React from 'react';
import { StyleSheet, View } from 'react-native';
import Form from '../component/Form';
import { MainTheme } from '../../../constant/lov';

type LoginScreenProps = {
  navigation?: {
    addListener?: (
      eventName: string,
      callback: () => void | Promise<void>,
    ) => (() => void) | { remove?: () => void };
  };
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Form navigation={navigation} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
  },
});
