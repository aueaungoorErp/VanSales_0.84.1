import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { Icon } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { mainContainer, MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import { toBuddhistYear } from '../../../utils/Date';

const Form = ({children, style}) => <View style={style}>{children}</View>;

const Item = ({children, style}) => <View style={style}>{children}</View>;

const Label = ({children, style, ...props}) => (
  <Text style={style} {...props}>
    {children}
  </Text>
);

const ProfileDetailForm = (props) => {
  const {customer} = props;
  const {
    INFO,
    CUS_ADDB,
    AR_SUMMARY,
    LST_VISIT_DOC,
    LST_BILL_DOC,
    CUS_PAY_INF,
    CREDIT_LIM,
  } = customer;
  console.log('g', customer);
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.titleSection}>
         
          <Image
            style={{width: 35, height: 35, alignSelf: 'center'}}
            resizeMode="contain"
            source={require('../../../images/customer_infomation.png')}
          />
          <Text
            style={{color: MainTheme.colorQuaternary, fontSize: hp('2.2%')}}
            allowFontScaling={false}>
            {' '}
            {strings('customer.profile')}{' '}
          </Text>
        </View>
        <Form>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.identity')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.AR_CODE}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_name')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.AR_NAME}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_name')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.AR_NAME}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_address1')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.ADDB_ADDB_1 ? INFO.ADDB_ADDB_1 : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_province')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.ADDB_PROVINCE ? INFO.ADDB_PROVINCE : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_address3')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.ADDB_ADDB_3 ? INFO.ADDB_ADDB_3 : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.label_address2')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {INFO.ADDB_ADDB_2 ? INFO.ADDB_ADDB_2 : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.last_visit')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {AR_SUMMARY && AR_SUMMARY.LST_VISIT_DOC
                  ? toBuddhistYear(AR_SUMMARY.LST_VISIT_DOC, '-', 2)
                  : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.last_sell_date')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {AR_SUMMARY && AR_SUMMARY.LAST_DI_DATE
                  ? toBuddhistYear(AR_SUMMARY.LAST_DI_DATE, '-', 2)
                  : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.last_bill_no')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {AR_SUMMARY && AR_SUMMARY.LAST_DI_REF
                  ? AR_SUMMARY.LAST_DI_REF
                  : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.last_sell_amount')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {AR_SUMMARY && AR_SUMMARY.LAST_DI_AMT
                  ? parseFloat(AR_SUMMARY.LAST_DI_AMT)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.credit_limit')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {AR_SUMMARY && AR_SUMMARY.ARS_CRE_LIM
                  ? parseFloat(AR_SUMMARY.ARS_CRE_LIM)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                  : null}
              </Text>
            </Item>
          </Item>
          <Item inlineLabel style={{paddingVertical: 5}}>
            <Label
              style={{color: '#000000', fontSize: hp('1.7%')}}
              allowFontScaling={false}>
              {strings('customer.credit_balance')}
            </Label>
            <Item
              style={[{flex: 0.8, paddingVertical: 11, borderBottomWidth: 0}]}>
              <Text
                style={{color: '#000000', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
              {AR_SUMMARY && AR_SUMMARY.ARS_CRE_REMAIN_NPDC
                ? parseFloat(AR_SUMMARY.ARS_CRE_REMAIN_NPDC)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                : null}
              </Text>
            </Item>
          </Item>
        </Form>
      </ScrollView>
    </View>
  );
};

export default ProfileDetailForm;

const styles = StyleSheet.create({
  container: mainContainer,
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
  },
});
