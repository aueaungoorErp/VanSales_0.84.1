import React from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Navigator from '../../../../services/Navigator';
import SummaryListItems from '../presenter/SummaryListItems';
import {MainTheme, mainDivider} from '../../../../constant/lov';

const CTSummaryListItems = (props) => {
  const {routes, index} = Navigator.getCurrentRoute();
  const {actionType} = routes[index].params;
  // console.log('props.order', props.order);
  const _header = () => (
    <ListItem
      title={
        <View>
          {props.order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า' ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                รหัส
              </Text>
              <Text
                style={{
                  width: 300,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ชื่อสินค้า
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                จำนวน
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ราคาต่อหน่วย
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ส่วนลด
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ส่วนลดการตลาด
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                แถม
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                มูลค่าก่อนภาษี
              </Text>
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ภาษี
              </Text>
              {/* <Text style={{width: 100, marginLeft: 5}}>มูลค่า</Text> */}
              <Text
                style={{
                  width: 100,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  textAlign: 'right',
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ราคาสุทธิ
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  flex: 0.2,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                รหัส
              </Text>
              <Text
                style={{
                  flex: 0.6,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                ชื่อสินค้า
              </Text>
              <Text
                style={{
                  flex: 0.2,
                  marginLeft: 5,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.6%'),
                }}
                allowFontScaling={false}>
                จำนวน
              </Text>
            </View>
          )}
        </View>
      }
      containerStyle={{backgroundColor: MainTheme.colorPrimary}}
      titleNumberOfLines={1}
      hideChevron
    />
  );

  const _footer = (item) => {
    const {
      totalQty,
      totalPrice,
      totalVat,
      totalFree,
      totalDiscount,
      netPrice,
    } = item;

    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 100, marginLeft: 5, hp: '1.6%'}}></Text>
            <Text style={{width: 300, marginLeft: 5, hp: '1.6%'}}></Text>
            <Text
              style={{
                width: 100,
                marginLeft: 5,
                textAlign: 'right',
                fontSize: hp('1.6%'),
              }}>
              {totalQty.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{
                width: 100,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}></Text>
            <Text
              style={{
                width: 100,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}>
              {totalDiscount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{
                width: 50,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}>
              {totalFree.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{
                width: 150,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}>
              {totalVat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{
                width: 100,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}>
              {totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{
                width: 100,
                marginLeft: 5,
                textAlign: 'right',
                hp: '1.6%',
              }}>
              {netPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: '#F9F995'}}
        titleNumberOfLines={1}
        hideChevron
      />
    );
  };

  const _renderItemOrderProductSummaryProcessed = ({item}) => {
    const {
      VTRD_CODE,
      VTRD_NAMES,
      VTRD_QTY,
      VTRD_U_PRC_KEYIN,
      VTRD_VALUES_B_VAT_B_DISC,
      VTRD_VAT,
      VTRD_Q_FREE,
      VTRD_U_DSC,
      VTRD_TDSC_V,
      VTRD_AF_VALUES,
      VTRD_AUTO,
      VTRD_B4_VAT,
      VTRD_CP_DSIC,
    } = item;
    // console.log('_renderItemOrderProductSummaryProcessed', item);
    return (
      <ListItem
        title={
          <View>
            {props.order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า' ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
                  allowFontScaling={false}>
                  {item.TRD_KEYIN}
                </Text>
                <Text
                  style={{width: 300, marginLeft: 5, fontSize: hp('1.6%')}}
                  allowFontScaling={false}>
                  {item.TRD_SH_NAME}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_QTY != null && item.TRD_QTY !== ''
                    ? parseFloat(item.TRD_QTY)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_K_U_PRC != null && item.TRD_K_U_PRC !== ''
                    ? parseFloat(item.TRD_K_U_PRC)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_DSC_KEYINV != null &&
                  item.TRD_DSC_KEYINV !== '' &&
                  item.TRD_DSC_KEYINV
                    ? parseFloat(item.TRD_DSC_KEYINV)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_C_DSCV != null && item.TRD_C_DSCV !== ''
                    ? parseFloat(item.TRD_C_DSCV)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_Q_FREE != null && item.TRD_Q_FREE !== ''
                    ? parseFloat(item.TRD_Q_FREE)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_G_SELL != null && item.TRD_G_SELL !== ''
                    ? parseFloat(item.TRD_G_SELL)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>

                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_G_VAT != null && item.TRD_G_VAT !== ''
                    ? parseFloat(item.TRD_G_VAT)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
                {/* <Text style={{width: 100, marginLeft: 5}}>
                                        { 
                                            VTRD_VALUES_B_VAT_B_DISC != null && VTRD_VALUES_B_VAT_B_DISC !== '' 
                                            ? VTRD_VALUES_B_VAT_B_DISC.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0 
                                        }
                                    </Text> */}
                <Text
                  style={{
                    width: 100,
                    marginLeft: 5,
                    textAlign: 'right',
                    fontSize: hp('1.6%'),
                  }}
                  allowFontScaling={false}>
                  {item.TRD_G_KEYIN != null && item.TRD_G_KEYIN !== ''
                    ? parseFloat(item.TRD_G_KEYIN)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{flex: 0.2, marginLeft: 5, fontSize: hp('1.6%')}}
                  allowFontScaling={false}>
                  {item.TRD_KEYIN}
                </Text>
                <Text
                  style={{flex: 0.6, marginLeft: 5, fontSize: hp('1.6%')}}
                  allowFontScaling={false}>
                  {item.TRD_SH_NAME}
                </Text>
                <Text
                  style={{flex: 0.2, textAlign: 'right', fontSize: hp('1.6%')}}
                  allowFontScaling={false}>
                  {item.TRD_QTY != null && item.TRD_QTY !== ''
                    ? parseFloat(item.TRD_QTY)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </Text>
              </View>
            )}
          </View>
        }
        containerStyle={[
          {
            backgroundColor:
              VTRD_AUTO === 1 ? '#AED6F1' : MainTheme.colorSecondary,
          },
          mainDivider,
        ]}
        bottomDivider
        titleNumberOfLines={1}
        hideChevron
      />
    );
  };

  const _renderItemOrderProductSummary = ({item}) => {
    const {
      VTRD_CODE,
      VTRD_NAMES,
      VTRD_QTY,
      VTRD_U_PRC_KEYIN,
      GOODS_TOTAL_PRC,
      GOODS_VAT_TY,
      VTRD_Q_FREE,
      GOODS_TOTAL_DISCOUNT,
      GOODS_NET_PRC,
      VTRD_CPSKU_QTY,
      VTRD_CPALT_QTY,
      VTRD_CPAKU_QTY,
    } = item;
    console.log('_renderItemOrderProductSummary');
    console.log('DSFDSFSD', item);
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {VTRD_CODE}
            </Text>
            <Text
              style={{width: 300, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {VTRD_NAMES}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {VTRD_QTY != null && VTRD_QTY !== ''
                ? VTRD_QTY.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {VTRD_U_PRC_KEYIN != null && VTRD_U_PRC_KEYIN !== ''
                ? VTRD_U_PRC_KEYIN.toFixed(2).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                  )
                : 0}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {GOODS_TOTAL_DISCOUNT != null && GOODS_TOTAL_DISCOUNT !== ''
                ? GOODS_TOTAL_DISCOUNT.toFixed(2).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                  )
                : 0}
            </Text>
            <Text
              style={{width: 50, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {VTRD_Q_FREE != null && VTRD_Q_FREE !== ''
                ? (
                    VTRD_Q_FREE +
                    VTRD_CPSKU_QTY +
                    VTRD_CPALT_QTY +
                    VTRD_CPAKU_QTY
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
            </Text>
            <Text
              style={{width: 150, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {GOODS_VAT_TY != null && GOODS_VAT_TY !== ''
                ? GOODS_VAT_TY.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {GOODS_TOTAL_PRC != null && GOODS_TOTAL_PRC !== ''
                ? GOODS_TOTAL_PRC.toFixed(2).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                  )
                : 0}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {GOODS_NET_PRC != null && GOODS_NET_PRC !== ''
                ? GOODS_NET_PRC.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
            </Text>
          </View>
        }
        bottomDivider
        titleNumberOfLines={1}
        containerStyle={mainDivider}
        hideChevron
      />
    );
  };

  return (
    <SummaryListItems
      header={_header}
      // footer={_footer(actionType === 'orderProductSummary' ? props.order.orderProductSummary : props.order.orderProductSummaryProcessed)}
      listItems={
        actionType === 'orderProductSummary'
          ? props.order.productListItems
          : props.order.productListItemsPRTProcessed
      }
      renderItem={
        actionType === 'orderProductSummary'
          ? _renderItemOrderProductSummary
          : _renderItemOrderProductSummaryProcessed
      }
      orderType={props.order.header.AR_ORDER_TYPE}
    />
  );
};

const mapStateToProps = (state) => ({
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSummaryListItems);
