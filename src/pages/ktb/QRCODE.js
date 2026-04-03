// import React, {useEffect, useState} from 'react';
// import {View, Text, BackHandler, Alert} from 'react-native';
// import {connect} from 'react-redux';
// import QRCode from 'react-native-qrcode-svg';
// import useCountDown from 'react-countdown-hook';
// import Navigator from '../../services/Navigator';
// import {Button, ThemeProvider} from '../../component/elements';
// import {postinvoice, getPaymentStatus} from '../../action/ktb-payment';

// const logoFromFile = require('../../images/krungthai_logo.jpg');
// const initialTime = 10 * 60 * 1000; // initial time in milliseconds, defaults to 60000
// const interval = 1000; // interval to change remaining time amount, defaults to 1000
// let first = null;
// function millisToMinutesAndSeconds(millis) {
//   var minutes = Math.floor(millis / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);
//   return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
// }

// const theme = {
//   Button: {
//     containerStyle: {
//       marginTop: 10,
//     },
//   },
// };

// const QRCODE = (props) => {
//   const {
//     accessToken,
//     data,
//     totalPrice,
//     qrcodeVaule,
//   } = props.route.params;
//   const [timeLeft, {start, pause, resume, reset}] = useCountDown(
//     initialTime,
//     interval,
//   );

//   const [status, setPaymentStatus] = useState(null);
//   const [errorMessage, setMessageError] = useState(null);

//   const resetAll = () => {
//     first = null;
//     setPaymentStatus(null);
//     reset();
//   };

//   // start the timer during the first render
//   useEffect(() => {
//     resetAll();
//     start();
//     postInvoice();
//   }, []);

//   useEffect(() => {
//     const backAction = () => {
//       Alert.alert(
//         'แจ้งเตือน',
//         'เมื่อคุณย้อนกลับเอกสารจะถูกปรับให้เป็นยกเลิก?',
//         [
//           {
//             text: 'ยกเลิก',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           {
//             text: 'ตกลง',
//             onPress: () => {
//               resetAll();
//             },
//           },
//         ],
//       );
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, []);
//   if (timeLeft === 0 && first === true) {
//     resetAll();
//     Navigator.back();
//   } else if (timeLeft > 0 && !first) {
//     first = true;
//   }

//   const postInvoice = async () => {
//     const postinvoice = await props.postinvoice(data, accessToken);
//     const {txnStatusCode, message} = postinvoice;
//     console.log('postinvoice ', JSON.stringify(postinvoice));
//     if (txnStatusCode === 200) {
//       const getPaymentStatusData = {
//         dscfTxnId: data.dscfTxnId,
//       };
//       const result = await props.getPaymentStatus(
//         getPaymentStatusData,
//         accessToken,
//       );
//       const {txnStatusCode, paymentStatus} = result;
//       if (txnStatusCode === 200 && paymentStatus) {
//         if (paymentStatus === 'Pending') {
//           setPaymentStatus(paymentStatus);
//         }
//       }
//     } else if (txnStatusCode === 400) {
//       const err = JSON.parse(message);
//       setMessageError(err.description);
//     }
//   };

//   const payment = async () => {
//     const getPaymentStatusData = {
//       dscfTxnId: data.dscfTxnId,
//     };
//     const result = await props.getPaymentStatus(
//       getPaymentStatusData,
//       accessToken,
//     );
//     const {txnStatusCode, paymentStatus} = result;
//     if (txnStatusCode === 200) {
//       if (paymentStatus === 'Pending') {
//         setPaymentStatus(paymentStatus);
//       } else if (paymentStatus === 'Paid') {
//         setPaymentStatus(paymentStatus);
//         Navigator.navigate('OrderSalesSummary', {
//           actionType: 'orderProductSummaryProcessed',
//           printType: 'cash',
//         });
//         resetAll();
//       }
//     }
//   };

//   props.navigation.addListener('focus', async () => {
//     resetAll();
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <View
//         style={{
//           flex: 1,
//           paddingTop: 30,
//           // justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <QRCode size={350} value={qrcodeVaule} logo={logoFromFile} />
//         {data && data.ref1 && (
//           <Text style={{fontSize: 18, paddingTop: 30}}>Ref1: {data.ref1}</Text>
//         )}
//         {data && data.sponsorTaxId && (
//           <Text style={{fontSize: 18, paddingTop: 10}}>
//             sponsorTaxId: {data.sponsorTaxId}
//           </Text>
//         )}
//         {data && data.invoice && (
//           <Text style={{fontSize: 18, paddingTop: 10}}>
//             invoiceId: {data.invoice.invoiceHdr.invoiceId}
//           </Text>
//         )}
//         {totalPrice && (
//           <Text style={{fontSize: 18, paddingTop: 10}}>
//             Amount: {totalPrice}
//           </Text>
//         )}
//         <Text style={{fontSize: 18, paddingTop: 8}}>
//           Time left: {millisToMinutesAndSeconds(timeLeft)}
//         </Text>
//         {status && <Text style={{fontSize: 18, paddingTop: 8}}>{status}</Text>}
//         {errorMessage && (
//           <Text style={{fontSize: 18, padding: 8, color: 'red'}}>
//             {errorMessage}
//           </Text>
//         )}

//         <Button
//           containerStyle={{backgroundColor: '#00a6e6'}}
//           large
//           title={'Get Payment Status'}
//           onPress={() => {
//             payment();
//           }}
//         />
//       </View>
//     </ThemeProvider>
//   );
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     postinvoice: (data, accessToken) =>
//       dispatch(postinvoice(data, accessToken)),
//     getPaymentStatus: (data, accessToken) =>
//       dispatch(getPaymentStatus(data, accessToken)),
//   };
// };

// export default connect(null, mapDispatchToProps)(QRCODE);

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import { getPaymentStatus, postinvoice } from '../../action/ktb-payment';
import { Button, ThemeProvider } from '../../component/elements';
import Navigator from '../../services/Navigator';

const logoFromFile = require('../../images/krungthai_logo.jpg');
const initialTime = 10 * 60 * 1000;
const interval = 1000;

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

const theme = {
  Button: {
    containerStyle: {
      marginTop: 10,
    },
  },
};

const MOCK_QRCODE_DATA = '00020101021153037645802TH29370016A0000006770101110213110400008173763049875';

const QRCODE = props => {
  const params = props.route?.params || {};
  const accessToken = params.accessToken || null;
  const data = params.data || null;
  const totalPrice = params.totalPrice || null;
  const qrcodeVaule = params.qrcodeVaule || MOCK_QRCODE_DATA;
  const isMock = !params.qrcodeVaule;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [status, setPaymentStatus] = useState(null);
  const [errorMessage, setMessageError] = useState(null);

  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);
  const postinvoiceRef = useRef(props.postinvoice);
  const getPaymentStatusRef = useRef(props.getPaymentStatus);

  useEffect(() => {
    postinvoiceRef.current = props.postinvoice;
    getPaymentStatusRef.current = props.getPaymentStatus;
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration = initialTime) => {
      clearTimer();
      hasStartedRef.current = true;
      setTimeLeft(duration);

      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= interval) {
            clearTimer();
            return 0;
          }
          return prevTime - interval;
        });
      }, interval);
    },
    [clearTimer],
  );

  const resetTimer = useCallback(() => {
    clearTimer();
    hasStartedRef.current = false;
    setTimeLeft(initialTime);
  }, [clearTimer]);

  const resetAll = useCallback(() => {
    setPaymentStatus(null);
    setMessageError(null);
    resetTimer();
  }, [resetTimer]);

  const postInvoice = useCallback(async () => {
    if (!data || !accessToken) return;
    try {
      const postinvoiceResult = await postinvoiceRef.current(data, accessToken);
      const {txnStatusCode, message} = postinvoiceResult;

      console.log('postinvoice ', JSON.stringify(postinvoiceResult));

      if (txnStatusCode === 200) {
        const getPaymentStatusData = {
          dscfTxnId: data.dscfTxnId,
        };

        const result = await getPaymentStatusRef.current(
          getPaymentStatusData,
          accessToken,
        );

        const {txnStatusCode: paymentTxnStatusCode, paymentStatus} = result;

        if (paymentTxnStatusCode === 200 && paymentStatus) {
          if (paymentStatus === 'Pending') {
            setPaymentStatus(paymentStatus);
          }
        }
      } else if (txnStatusCode === 400) {
        const err = JSON.parse(message);
        setMessageError(err.description);
      }
    } catch (e) {
      console.warn('postInvoice error:', e);
      setMessageError(e.message || 'Network error');
    }
  }, [data, accessToken]);

  const payment = useCallback(async () => {
    if (!data || !accessToken) return;
    try {
      const getPaymentStatusData = {
        dscfTxnId: data.dscfTxnId,
      };

      const result = await getPaymentStatusRef.current(
        getPaymentStatusData,
        accessToken,
      );

      const {txnStatusCode, paymentStatus} = result;

      if (txnStatusCode === 200) {
        if (paymentStatus === 'Pending') {
          setPaymentStatus(paymentStatus);
        } else if (paymentStatus === 'Paid') {
          setPaymentStatus(paymentStatus);
          Navigator.navigate('OrderSalesSummary', {
            actionType: 'orderProductSummaryProcessed',
            printType: 'cash',
          });
          resetAll();
        }
      }
    } catch (e) {
      console.warn('payment error:', e);
    }
  }, [data, accessToken, resetAll]);

  // Mount effect — run once
  useEffect(() => {
    startTimer();
    if (!isMock) {
      postInvoice();
    }

    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'แจ้งเตือน',
        'เมื่อคุณย้อนกลับเอกสารจะถูกปรับให้เป็นยกเลิก?',
        [
          {
            text: 'ยกเลิก',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'ตกลง',
            onPress: () => {
              resetAll();
            },
          },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [resetAll]);

  useEffect(() => {
    if (timeLeft === 0 && hasStartedRef.current) {
      resetAll();
      Navigator.back();
    }
  }, [timeLeft, resetAll]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      resetAll();
    });

    return unsubscribe;
  }, [props.navigation, resetAll]);

  return (
    <ThemeProvider theme={theme}>
      <View
        style={{
          flex: 1,
          paddingTop: 30,
          alignItems: 'center',
        }}>
        <QRCode size={350} value={qrcodeVaule} logo={logoFromFile} />

        {data && data.ref1 && (
          <Text style={{fontSize: 18, paddingTop: 30}}>Ref1: {data.ref1}</Text>
        )}

        {data && data.sponsorTaxId && (
          <Text style={{fontSize: 18, paddingTop: 10}}>
            sponsorTaxId: {data.sponsorTaxId}
          </Text>
        )}

        {data && data.invoice && (
          <Text style={{fontSize: 18, paddingTop: 10}}>
            invoiceId: {data.invoice.invoiceHdr.invoiceId}
          </Text>
        )}

        {totalPrice && (
          <Text style={{fontSize: 18, paddingTop: 10}}>
            Amount: {totalPrice}
          </Text>
        )}

        <Text style={{fontSize: 18, paddingTop: 8}}>
          Time left: {millisToMinutesAndSeconds(timeLeft)}
        </Text>

        {status && (
          <Text style={{fontSize: 18, paddingTop: 8}}>{status}</Text>
        )}

        {errorMessage && (
          <Text style={{fontSize: 18, padding: 8, color: 'red'}}>
            {errorMessage}
          </Text>
        )}

        <Button
          containerStyle={{backgroundColor: '#00a6e6'}}
          large
          title={'Get Payment Status'}
          onPress={payment}
        />
      </View>
    </ThemeProvider>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    postinvoice: (data, accessToken) =>
      dispatch(postinvoice(data, accessToken)),
    getPaymentStatus: (data, accessToken) =>
      dispatch(getPaymentStatus(data, accessToken)),
  };
};

export default connect(null, mapDispatchToProps)(QRCODE);
