import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';

const toInputValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const KTBSettingForm = (props) => {
  const {
    ktbURL,
    setKTBUrl,
    buttonListItems,
    renderItem,
    successMessage,
    errorMessage,
    isLoading,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{strings('login_setting.ktb')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={toInputValue(ktbURL)}
            onChangeText={setKTBUrl}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <IButtonGroupCustom
        listItems={buttonListItems}
        renderItem={renderItem}
        style={iButtonGroupCustomStyles}
      />

      <View style={styles.MessageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>
    </View>
  );
};

export default KTBSettingForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.7%'),
    marginBottom: 6,
  },
  inputContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: hp('1.7%'),
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
  },
  bodySection: {},
  MessageBox: {
    alignContent: 'center',
    marginTop: 15,
    height: 30,
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    height: 60,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
});
