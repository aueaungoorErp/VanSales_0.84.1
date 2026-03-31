import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    GetPrintReport,
    downloadReport,
    getPrintStatus,
    getReportName
} from '../../../action/report';
import { ListItem } from '../../../component/elements';
import { mainDivider } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import ListItems from '../presenter/ListItems';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const Detail = (props) => {
  const dispatch = useDispatch();
  let isLoading = false;
  let loading = false;
  let clockCall = null;
  const defaultCountDown = -1;
  const [countdown, setCountdown] = useState(defaultCountDown);
  const reportReducer = useSelector(({report}) => report);

  useEffect(() => {
    fetchData();
  }, []);
  const [GETREPORTNAME, setGETREPORTNAME] = useState(
    reportReducer.dataReportV3,
  );
  useEffect(() => {
    if (countdown != -1) {
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
      return () => {
        clearInterval(clockCall);
      };
    }
  }, [countdown]);
  const [RPTQUE_GUID, setRPTQUE_GUID] = useState(null);
  const fetchData = async () => {
    const res = await dispatch(getReportName());
    setGETREPORTNAME(res);
  };

  const decrementClock = async () => {
    if (countdown == 0) {
      setCountdown(0);
      clearInterval(clockCall);
    } else if (countdown == 16) {
      await _getStatus(RPTQUE_GUID);
    } else {
      setCountdown(countdown - 1);
    }
  };

  const setnewdateF = (date) => {
    var x = new Date(date);

    var day = x.getDate();
    if (day < 10) day = '0' + day.toString();

    var month = x.getMonth() + 1;
    if (month < 10) month = '0' + month.toString();

    var year = x.getFullYear();
    return year + '' + month + '' + day;
  };

  useEffect(() => {
    if (countdown == 0) {
      console.log('countdown == 0 RPTQUE_GUID', RPTQUE_GUID);
    }
  }, [countdown]);

  const _onItemPress = async (item) => {
    const {FROM, TO} = reportReducer.date;
    if (FROM > TO) {
      alert('กรุณาเลือกวันที่ให้ถูกต้อง');
    } else {
      const conDateFrom = setnewdateF(FROM);
      const conDateTo = setnewdateF(TO);

      const res = await dispatch(
        GetPrintReport(item.RPTSVR_GUID, conDateFrom, conDateTo),
      );
      setRPTQUE_GUID(res.RPTQUE_GUID);

      await _getStatus(res.RPTQUE_GUID);
      console.log('res2 =>');
    }
  };

  const _getStatus = async (RPTQUE_GUID) => {
    const res2 = await dispatch(getPrintStatus(RPTQUE_GUID));
    if (res2.RPTQUE_RSLT_STATUS == 0) {
      console.log('res2 == 0');
      setCountdown(18);
    } else if (res2.RPTQUE_RSLT_STATUS == 1) {
      console.log('res2 == 1 reportReducer.dataStatus', res2);
      setCountdown(-1);
      const res = await dispatch(downloadReport(res2));

      console.log('333333333', res);
      if (res) {
        Navigator.navigate('ReportPaPerless');
      }
    } else if (res2 == -2) {
      setCountdown(18);
    } else {
      console.log('res2 == else', res2.SYSLKUP_T_DESC);
      Alert.alert(
        res2.RPTSVR_NAME,
        res2.SYSLKUP_T_DESC,
        [{text: 'ตกลง', onPress: () => {}}],
        {cancelable: false},
      );
      setCountdown(-1);
    }
  };
  const _onRefresh = () => {
    fetchData();
  };
  const _onScroll = (event) => {};
  const _actionHandler = () => {};
  const _onReload = async () => {};

  const _renderItem = ({item}) => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text>{item.RPTSVR_NAME ? item.RPTSVR_NAME : '???'}</Text>
            </View>
          </View>
        }
        hideChevron
        onPress={() => {
          _onItemPress(item);
        }}
        containerStyle={mainDivider}
        bottomDivider
      />
    );
  };

  return (
    <View style={styles.container}>
      <ListItems
        renderItem={_renderItem}
        onRefresh={_onRefresh}
        onScroll={_onScroll}
        actionHandler={_actionHandler}
        listItems={
          reportReducer.dataReportV3
            ? reportReducer.dataReportV3
            : GETREPORTNAME
        }
        // isNotFound={
        //   this._campaignCode !== null
        //     ? this.props.campaignARCPGNType.isNotFound
        //     : this.props.campaignType.isNotFound
        // }
        errorMessage={reportReducer.errorMessage}
        isError={reportReducer.isError}
        // isSnackBarVisible={this.state.isSnackBarVisible}
        onButtonPress={_onReload}
        isLoading={reportReducer.isLoading}
        paperlessErrorMessage={reportReducer.errorMessage}
      />

      {/* {reportReducer.isLoading &&
        (reportReducer.dataReportV3.length > 0 ? (
          <>
            <View
              style={{
                width: deviceWidth,
                height: deviceHeight,
                opacity: 0.5,
                backgroundColor: 'black',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                position: 'absolute',
              }}>
              <View
                style={{
                  opacity: 0.8,
                  backgroundColor: 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 20,
                }}>
                <View>
                  <Text style={styles.textTitle}>กำลังสั่งพิมพ์</Text>
                </View>
                <View>
                  <Text style={styles.textTitle}>
                    {GETPRINTSTATUS[0].RPTSVR_NAME}
                  </Text>
                </View>
                <ActivityIndicator
                  style={{
                    borderRadius: 15,
                    backgroundColor: null,
                    width: 100,
                    height: 100,
                    alignSelf: 'center',
                  }}
                  animating={loading}
                  size="large"
                  color={'green'}
                />
                <View>
                  <Text style={styles.textTitle}>
                    {GETPRINTSTATUS[0].SYSLKUP_T_DESC}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,
              backgroundColor: 'black',
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
            }}>
            <ActivityIndicator
              style={{
                borderRadius: 15,
                backgroundColor: null,
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
              animating={loading}
              size="large"
              color={'green'}
            />
          </View>
        ))} */}
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {flex: 1},
});
