import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {mainContainer} from '../../../../constant/lov';
import CTSearchForm from '../../container/drop-point/CTSearchForm';
import CTListItems from '../../container/drop-point/CTListItems';

const Index = (props) => {
    const {isFirst} = props.route.params;
  return (
    <View style={[styles.container]}>
      <Text>{
        //isFirst ? 'จาก 2' : 'ถึง 2'
      }</Text>
      <CTSearchForm isFirst={isFirst}/>
      <Text style={{color:'#1c8c89',fontWeight:'bold'}}>{'  '}{
        isFirst ? 'Step 1 : เลือกต้นทาง >>' : 'Step 2 :  โอนย้ายไปยัง'
      }</Text>
      <CTListItems actionType={'transfer'} isFirst={isFirst} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: mainContainer,
});
