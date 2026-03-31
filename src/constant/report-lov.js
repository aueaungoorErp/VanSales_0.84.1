import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainTheme, mainDivider } from '../constant/lov';
import { decimal2digitWithCommas } from '../utils/FormatUtil';

const ListItem = ({title, containerStyle, bottomDivider}) => (
  <View style={[{paddingVertical: 8, paddingHorizontal: 10}, containerStyle, bottomDivider && {borderBottomWidth: 1, borderBottomColor: '#e1e8ee'}]}>
    {title}
  </View>
);
const fontDefault = '1.7%';
// report #1
export const salesOrderByCategory = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1.5,
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              ประเภทสินค้า
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              จำนวนรวม
            </Text>
             <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              จำนวนแถม
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              ยอดขาย
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                paddingVertical: 15,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>
            {item.ITEMS.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1.5, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.ICCAT_NAME}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.SKUQTY}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.SKUQFREE}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {decimal2digitWithCommas(parseFloat(row.SKUAMT))}
                </Text>
              </View>
            ))}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{flex: 1.5, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {item.GROUP_SUM_QTY}
              </Text>
               <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {item.GROUP_SUM_QFREE}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {decimal2digitWithCommas(parseFloat(item.GROUP_SUM_AMT))}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View style={{backgroundColor: MainTheme.colorSeptenary}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{
                flex: 1.5,
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_QTY}
            </Text>
             <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_QFREE}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.ITEM_AMT))}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1.5,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_QTY}
          </Text>
           <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_QFREE}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          รวม
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
  footerItem: true,
};

// report #2
export const salesOrderByProduct = {
  header: () => {
    return (
      <ListItem
        title={
          Dimensions.get('window').width > 450 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                ชื่อสินค้า
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                จำนวนขาย
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                จำนวนแถม
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                ยอดขาย
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  width: 200,
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}>
                ชื่อสินค้า
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                จำนวนขาย
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                จำนวนแถม
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp('1.7%'),
                }}
                allowFontScaling={false}>
                ยอดขาย
              </Text>
            </View>
          )
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    console.log(JSON.stringify(item));
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                paddingVertical: 15,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => {
              // console.log("row ",row);
              return Dimensions.get('window').width > 450 ? (
                <View style={{flexDirection: 'row', padding: 15}} key={i}>
                  <Text
                    style={{flex: 1, fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    {row.SKU_NAME}
                  </Text>
                  <Text
                    style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    {row.SKUSELLQTY}
                  </Text>
                  <Text
                    style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    {row.SKUFREEQTY}
                  </Text>
                  <Text
                    style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    {decimal2digitWithCommas(parseFloat(row.SKUAMT))}
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', padding: 15}} key={i}>
                  <Text
                    style={{width: 200, fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    {row.SKU_NAME}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp('1.7%'),
                    }}
                    allowFontScaling={false}>
                    {row.SKUSELLQTY}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp('1.7%'),
                    }}
                    allowFontScaling={false}>
                    {row.SKUFREEQTY}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp('1.7%'),
                    }}
                    allowFontScaling={false}>
                    {decimal2digitWithCommas(parseFloat(row.SKUAMT))}
                  </Text>
                </View>
              );
            })}

            {Dimensions.get('window').width > 450 ? (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#E5E4E2',
                  padding: 15,
                }}>
                <Text
                  style={{flex: 1, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  รวม
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {item.GROUP_SUM_QTY}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {item.GROUP_SUM_FREE_QTY}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {decimal2digitWithCommas(parseFloat(item.GROUP_SUM_AMT))}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#E5E4E2',
                  padding: 15,
                }}>
                <Text
                  style={{width: 200, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  รวม
                </Text>
                <Text
                  style={{width: 150, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {item.GROUP_SUM_QTY}
                </Text>
                <Text
                  style={{width: 150, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {item.GROUP_SUM_FREE_QTY}
                </Text>
                <Text
                  style={{width: 150, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {decimal2digitWithCommas(parseFloat(item.GROUP_SUM_AMT))}
                </Text>
              </View>
            )}
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        // bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {

    return Dimensions.get('window').width > 450 ? (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.ITEMS.SUMMARY_SECTION.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{flex: 1, color: MainTheme.colorFourteendary}}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_SELL_QTY}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_FREE_QTY}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.ITEM_AMT))}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{flex: 1, color: MainTheme.colorFourteendary}}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_QTY}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_FREE_QTY}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    ) : (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{
                width: 200,
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_SELL_QTY}
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {item.ITEM_FREE_QTY}
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.ITEM_AMT))}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              width: 200,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_QTY}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {item.SUM_FREE_QTY}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return Dimensions.get('window').width > 450 ? (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{flex: 1, color: MainTheme.colorFourteendary}}
          allowFontScaling={false}>
          รวมทั้งสิ้น
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {item.SUM_FREE_QTY}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    ) : (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            width: 200,
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          รวมทั้งสิ้น
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {item.SUM_FREE_QTY}
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp('1.7%'),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'phone',
  footerSummary: false,
  footerItem: true,
};

// report #3
export const salesOrderByArline = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1.5,
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              สายลูกค้า
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              จำนวนรวม
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              จำนวนแถม
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp('1.7%'),
              }}
              allowFontScaling={false}>
              ยอดรวม
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                paddingVertical: 15,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1.5, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.ARL_NAME}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.SKUSELLQTY}
                </Text>
                 <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {row.SKUQFREE}
                </Text>
                <Text
                  style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  {decimal2digitWithCommas(parseFloat(row.SKUAMT))}
                </Text>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{flex: 1.5, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {item.GROUP_SUM_QTY}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {item.GROUP_SUM_QFREE}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {decimal2digitWithCommas(parseFloat(item.GROUP_SUM_AMT))}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{
                flex: 1.5,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_QTY}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_QFREE}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.ITEM_AMT))}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1.5,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม 
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_QTY}
          </Text>
           <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_QFREE}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          รวมทั้งสิ้น
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
  footerItem: true,
};

// report #4
export const salesOrderByDocType = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ประเภทเอกสาร
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              จำนวนบิล
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ยอดขาย
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1, fontSize: hp(fontDefault)}}
                  allowFontScaling={false}>
                  {row.DOCGROUP}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.DOCOUNT}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {decimal2digitWithCommas(parseFloat(row.SKUAMT))}
                </Text>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{flex: 1, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {item.GROUP_SUMDOCOUNT}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {decimal2digitWithCommas(parseFloat(item.GROUP_SUM_AMT))}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View style={{backgroundColor: MainTheme.colorSeptenary}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_DO_COUNT}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.ITEM_AMT))}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_DOCOUNT}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          รวม
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_DOCOUNT}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
  footerItem: true,
};

// report #5
export const salesOrderByPmt = {
  header: () => {
    return (
      <ListItem
        title={
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorSecondary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                ประเภทชำระ
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: MainTheme.colorSecondary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                ยอดขาย
              </Text>
            </View>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1, fontSize: hp(fontDefault)}}
                  allowFontScaling={false}>
                  {row.PMT_NAME}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.PMTAMT}
                </Text>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{flex: 1, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {decimal2digitWithCommas(parseFloat(item.GROUP_AMT))}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View style={{backgroundColor: MainTheme.colorSeptenary}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION.ITEMS.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_AMT}
            </Text>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม {item.SUM_COUNT} รายการ
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorSeptenary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          รวมทั้งสิ้น {item.SUM_COUNT} รายการ
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
  footerItem: true,
};

// report #6
export const documentItems = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              เลขที่
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ชื่อลูกค้า
            </Text>
            <Text
              style={{
                width: 100,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {/* ชำระ */}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รายการ
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ชิ้น
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ยอดก่อนลด
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ส่วนลด
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ยอดขาย
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    //console.log('III ', JSON.stringify(item));
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => {
              return (
                <View key={i}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#C2DFFF',
                      padding: 15,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        color: '#438D80',
                        fontSize: hp(fontDefault),
                      }}
                      allowFontScaling={false}>
                      {row.DOCGROUP}
                    </Text>
                  </View>

                  {row.ITEMS.map((row, key) => {
                    return (
                      <View
                        key={key}
                        style={{
                          flexDirection: 'row',
                          padding: 15,
                        }}>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}>
                          {row.DI_REF}
                        </Text>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}>
                          {row.AR_NAME}
                        </Text>
                        <Text
                          style={{width: 100, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}>
                          {/* {row.PAYNAME} */}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRH_N_ITEMS}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRH_N_QTY}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {decimal2digitWithCommas(parseFloat(row.ARD_G_KEYIN))}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {decimal2digitWithCommas(
                            parseFloat(row.ARD_TDSC_KEYINV),
                          )}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {decimal2digitWithCommas(parseFloat(row.ARD_A_AMT))}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
   // console.log('footerRenderItem2', JSON.stringify(item));
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>

        {item?.SUMMARY_SECTION.GROUP?.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{width: 250, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item.GROUP_NAME}
            </Text>
            <Text
              style={{width: 50, fontSize: hp(fontDefault)}}
              allowFontScaling={false}></Text>
            <Text
              style={{width: 100, fontSize: hp(fontDefault)}}
              allowFontScaling={false}></Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.GROUP_ITEM_TRH_N_ITEMS}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.GROUP_ITEM_TRH_N_QTY}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.GROUP_ITEM_ARD_G_KEYIN))}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(
                parseFloat(item.GROUP_ITEM_ARD_TDSC_KEYINV),
              )}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {decimal2digitWithCommas(parseFloat(item.GROUP_ITEM_AMT))}
            </Text>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{width: 150, fontSize: hp(fontDefault)}}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{width: 150, fontSize: hp(fontDefault)}}
            allowFontScaling={false}></Text>
          <Text
            style={{width: 100, fontSize: hp(fontDefault)}}
            allowFontScaling={false}></Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_TRH_N_QTY}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_TRH_N_ITEMS}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(
              parseFloat(item.SUMMARY_SECTION.SUM_ARD_G_KEYIN),
            )}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(
              parseFloat(item.SUMMARY_SECTION.SUM_ARD_TDSC_KEYINV),
            )}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {decimal2digitWithCommas(parseFloat(item.SUMMARY_SECTION.SUM_AMT))}
          </Text>
        </View>
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        {/* <Text style={{ width: 100, color: MainTheme.colorFourteendary, fontSize: hp(fontDefault) }} allowFontScaling={false} >รวมทั้งสิ้น</Text> */}
        <Text
          style={{width: 150, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{width: 200, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{width: 100, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_TRH_N_QTY}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ARD_G_KEYIN}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ARD_TDSC_KEYINV}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {decimal2digitWithCommas(parseFloat(item.SUM_AMT))}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'both',
  footerSummary: false,
  footerItem: true,
};

// report #6.5
export const documentItemsDetails = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              เลขที่
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ชื่อลูกค้า
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รหัสลูกค้า
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รหัสซื้อขาย
            </Text>
            <Text
              style={{
                width: 200,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รายละเอียด
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              จำนวน
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              แถม
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ราคา@
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ส่วนลดรายการ
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ยอดเงิน
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => (
              <View key={i}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#C2DFFF',
                    padding: 15,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      color: '#438D80',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.DOCGROUP}
                  </Text>
                </View>
                {row.ITEMS.map((row, key) => (
                  <>
                    <View
                      key={key}
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        {row.DOCGROUP}
                      </Text>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        {row.AR_NAME}
                      </Text>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        {row.AR_CODE}
                      </Text>
                    </View>
                    {row.ITEMS.map((row, key) => (
                      <View
                        key={key}
                        style={{
                          flexDirection: 'row',
                          padding: 15,
                        }}>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}></Text>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}></Text>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}></Text>
                        <Text
                          style={{width: 150, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}>
                          {row.TRD_KEYIN}
                        </Text>
                        <Text
                          style={{width: 200, fontSize: hp(fontDefault)}}
                          allowFontScaling={false}>
                          {row.TRD_SH_NAME}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRD_SH_QTY == 0 ? ' ' : row.TRD_SH_QTY}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRD_Q_FREE == 0 ? ' ' : row.TRD_Q_FREE}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRD_SH_UPRC == 0 ? ' ' : row.TRD_SH_UPRC}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {row.TRD_DSC_KEYINV == 0
                            ? ' '
                            : decimal2digitWithCommas(
                                parseFloat(row.TRD_DSC_KEYINV),
                              )}
                        </Text>
                        <Text
                          style={{
                            width: 100,
                            textAlign: 'right',
                            fontSize: hp(fontDefault),
                          }}
                          allowFontScaling={false}>
                          {decimal2digitWithCommas(parseFloat(row.TRD_SH_GAMT))}
                        </Text>
                      </View>
                    ))}
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        มูลค่ารวมก่อนลด
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: hp(fontDefault),
                        }}
                        allowFontScaling={false}>
                        {decimal2digitWithCommas(parseFloat(row.ARD_G_KEYIN))}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,

                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        ส่วนลดท้ายบิล
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: hp(fontDefault),
                        }}
                        allowFontScaling={false}>
                        {decimal2digitWithCommas(
                          parseFloat(row.ARD_TDSC_KEYINV),
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,

                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        ยอดสินค้า
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: hp(fontDefault),
                        }}
                        allowFontScaling={false}>
                        {decimal2digitWithCommas(
                          parseFloat(row.SUM_TRD_B_SELL),
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,

                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        ยอด ภพ.
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: hp(fontDefault),
                        }}
                        allowFontScaling={false}>
                        {row.SUM_TRD_B_VAT}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{width: 150, fontSize: hp(fontDefault)}}
                        allowFontScaling={false}>
                        ยอดสุทธิ
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: hp(fontDefault),
                          paddingVertical: 5,
                        }}
                        allowFontScaling={false}>
                        {decimal2digitWithCommas(parseFloat(row.ARD_A_AMT))}
                      </Text>
                    </View>
                  </>
                ))}

                {/* <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    backgroundColor: MainTheme.colorThirteendary,
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems:'center'
                  }}>
                  <Text
                    style={{width: 150, fontSize: hp(fontDefault)}}
                    allowFontScaling={false}>
                    ยอดรวมทั้งหมด
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      fontSize: hp(fontDefault),
                      paddingVertical: 5,
                    }}
                    allowFontScaling={false}>
                    {row.ARD_A_AMT}
                  </Text>
                </View> */}
              </View>
            ))}
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View>
        {/* <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorSeptenary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorQuaternary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View> */}

        {/* {item.SUMMARY_SECTION.ITEMS.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: MainTheme.colorThirteendary,
              padding: 15,
            }}
            key={i}>
            <Text
              style={{width: 150, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{width: 150, fontSize: hp(fontDefault)}}
              allowFontScaling={false}></Text>
            <Text
              style={{width: 150, fontSize: hp(fontDefault)}}
              allowFontScaling={false}></Text>
            <Text
              style={{width: 200, fontSize: hp(fontDefault)}}
              allowFontScaling={false}></Text>

            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_TRH_N_ITEMS}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_TRH_N_QTY}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_ARD_G_KEYIN}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_ARD_TDSC_KEYINV}
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_AMT}
            </Text>
          </View>
        ))} */}

        {/* <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{width: 150, fontSize: hp(fontDefault)}}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{width: 150, fontSize: hp(fontDefault)}}
            allowFontScaling={false}></Text>

          <Text
            style={{width: 200, fontSize: hp(fontDefault)}}
            allowFontScaling={false}></Text>
          <Text
            style={{width: 150, fontSize: hp(fontDefault)}}
            allowFontScaling={false}></Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_TRH_N_ITEMS}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_TRH_N_QTY}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_ARD_G_KEYIN}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_ARD_TDSC_KEYINV}
          </Text>
          <Text
            style={{
              width: 100,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUM_AMT}
          </Text>
        </View> */}
      </View>
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        {/* <Text style={{ width: 100, color: MainTheme.colorFourteendary, fontSize: hp(fontDefault) }} allowFontScaling={false} >รวมทั้งสิ้น</Text> */}
        <Text
          style={{width: 150, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{width: 200, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{width: 100, fontSize: hp(fontDefault)}}
          allowFontScaling={false}></Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_TRH_N_QTY}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_QTY}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ARD_G_KEYIN}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ARD_TDSC_KEYINV}
        </Text>
        <Text
          style={{
            width: 100,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_AMT}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'both',
  footerSummary: false,
  footerItem: true,
};
// report #7
export const performanceByArlineItem = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              สายลูกค้า
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              จำนวน
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              ขาย
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              เยี่ยม
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              สำราจ
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) =>
              row.ITEMS.map((row, key) => (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    padding: 15,
                  }}>
                  <Text
                    style={{width: 150, fontSize: hp(fontDefault)}}
                    allowFontScaling={false}>
                    {row.ARL_NAME}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTAR}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTSELLBOOK}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTVISIT}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTSURVEY}
                  </Text>
                </View>
              )),
            )}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{width: 150, fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                รวมทั้งสิ้น
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTAR}
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTSELLBOOK}
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTVISIT}
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTSURVEY}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  renderItemPercent: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) =>
              row.ITEMS_PERCENT.map((row, key) => (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    padding: 15,
                  }}>
                  <Text
                    style={{width: 150, fontSize: hp(fontDefault)}}
                    allowFontScaling={false}>
                    {row.ARL_NAME}
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTAR_PERCENT}%
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTSELLBOOK_PERCENT}%
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTVISIT_PERCENT}%
                  </Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: 'right',
                      fontSize: hp(fontDefault),
                    }}
                    allowFontScaling={false}>
                    {row.COUNTSURVEY_PERCENT}%
                  </Text>
                </View>
              )),
            )}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{width: 150, fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                รวมทั้งสิ้น
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTAR_PERCENT}
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTSELLBOOK_PERCENT}%
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTVISIT_PERCENT}%
              </Text>
              <Text
                style={{
                  width: 150,
                  textAlign: 'right',
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.SUM_COUNTSURVEY_PERCENT}%
              </Text>
            </View>
          </View>
          // <View style={{flexDirection: 'row', padding: 15}}>
          //     <Text style={{ width: 150, fontSize: hp(fontDefault) }} allowFontScaling={false} >{item.ARL_NAME}</Text>
          //     <Text style={{ width: 150, textAlign: 'right', fontSize: hp(fontDefault) }} allowFontScaling={false} >{item.COUNTAR}%</Text>
          //     <Text style={{ width: 150, textAlign: 'right', fontSize: hp(fontDefault) }} allowFontScaling={false} >{item.COUNTSELLBOOK}%</Text>
          //     <Text style={{ width: 150, textAlign: 'right', fontSize: hp(fontDefault) }} allowFontScaling={false} >{item.COUNTVISIT}%</Text>
          //     <Text style={{ width: 150, textAlign: 'right', fontSize: hp(fontDefault) }} allowFontScaling={false} >{item.COUNTSURVEY}%</Text>
          // </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>

        {item.SUMMARY_SECTION.ITEMS.map((item, key) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              padding: 15,
              backgroundColor: MainTheme.colorThirteendary,
            }}>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTAR}
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSELLBOOK}
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTVISIT}
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSURVEY}
            </Text>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              width: 150,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTAR}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSELLBOOK}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTVISIT}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSURVEY}
          </Text>
        </View>
      </View>
    );
  },
  footerRenderItemPercent: (item) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>
        {item.SUMMARY_SECTION_PERCENT.ITEMS.map((item, key) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              padding: 15,
              backgroundColor: MainTheme.colorThirteendary,
            }}>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                width: 150,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTAR_PERCENT}%
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSELLBOOK_PERCENT}%
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTVISIT_PERCENT}%
            </Text>
            <Text
              style={{
                width: 150,
                textAlign: 'right',
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSURVEY_PERCENT}%
            </Text>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              width: 150,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION_PERCENT.SUM_COUNTAR_PERCENT + '%'}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION_PERCENT.SUM_COUNTSELLBOOK_PERCENT + '%'}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION_PERCENT.SUM_COUNTVISIT_PERCENT + '%'}
          </Text>
          <Text
            style={{
              width: 150,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION_PERCENT.SUM_COUNTSURVEY_PERCENT + '%'}
          </Text>
        </View>
      </View>
    );
  },
  footer: (displayType, item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            width: 150,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          รวม
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {displayType === 0
            ? item.SUM_COUNTSELLBOOK
            : item.SUM_COUNTSELLBOOK_PERCENT + '%'}
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {displayType === 0
            ? item.SUM_COUNTVISIT
            : item.SUM_COUNTVISIT_PERCENT + '%'}
        </Text>
        <Text
          style={{
            width: 150,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {displayType === 0
            ? item.SUM_COUNTSURVEY
            : item.SUM_COUNTSURVEY_PERCENT + '%'}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'both',
  footerSummary: false,
  footerItem: true,
};

// report #8
export const peformanceByProductCategory = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              หมวดสินค้า
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รายการทั้งหมด
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              รายการขาย
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>
            {item.ITEMS.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1, fontSize: hp(fontDefault)}}
                  allowFontScaling={false}>
                  {row.ICDEPT_THAIDESC}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.COUNTSKU}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.COUNTSKM}
                </Text>
              </View>
            ))}
            <View
              style={{
                flexDirection: 'row',
                padding: 15,
                backgroundColor: '#E5E4E2',
              }}>
              <Text
                style={{flex: 1, fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_COUNTSKU}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_COUNTSKM}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  renderItemPercent: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                วันที่ {item.GROUP_NAME}
              </Text>
            </View>
            {item.ITEMS_PERCENT.map((row, i) => (
              <View style={{flexDirection: 'row', padding: 15}} key={i}>
                <Text
                  style={{flex: 1, fontSize: hp(fontDefault)}}
                  allowFontScaling={false}>
                  {row.ICDEPT_THAIDESC}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.COUNTSKU}%
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: hp(fontDefault),
                  }}
                  allowFontScaling={false}>
                  {row.COUNTSKM}%
                </Text>
              </View>
            ))}
            <View
              style={{
                flexDirection: 'row',
                padding: 15,
                backgroundColor: '#E5E4E2',
              }}>
              <Text
                style={{flex: 1, fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                รวม
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_COUNTSKU_PERCENT}%
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_COUNTSKM_PERCENT}%
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footerRenderItem: (item) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>

        {item.SUMMARY_SECTION.ITEMS.map((item, key) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              padding: 15,
              backgroundColor: MainTheme.colorThirteendary,
            }}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSKU}
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSKM}
            </Text>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSKU}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSKM}
          </Text>
        </View>
      </View>
    );
  },
  footerRenderItemPercent: (item) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp('1.7%'),
            }}
            allowFontScaling={false}>
            รวมทั้งสิ้น
          </Text>
        </View>

        {item.SUMMARY_SECTION.ITEMS.map((item, key) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              padding: 15,
              backgroundColor: MainTheme.colorThirteendary,
            }}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_NAME}
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSKU_PERCENT}%
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorFourteendary,
                textAlign: 'right',
                fontSize: hp(fontDefault),
              }}
              allowFontScaling={false}>
              {item.ITEM_COUNTSKM_PERCENT}%
            </Text>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: MainTheme.colorThirteendary,
            padding: 15,
          }}>
          <Text
            style={{
              flex: 1,
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            รวม
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSKU_PERCENT}%
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: MainTheme.colorFourteendary,
              fontSize: hp(fontDefault),
            }}
            allowFontScaling={false}>
            {item.SUMMARY_SECTION.SUM_COUNTSKM_PERCENT}%
          </Text>
        </View>
      </View>
    );
  },
  footer: (displayType, item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          รวมทั้งสิ้น
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {displayType === 0
            ? item.SUM_COUNTSKU.toString()
            : item.SUM_COUNTSKU_PERCENT.toFixed(2).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ',',
              ) + '%'}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {displayType === 0
            ? item.SUM_COUNTSKM.toString()
            : item.SUM_COUNTSKM_PERCENT.toFixed(2).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ',',
              ) + '%'}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
  footerItem: true,
};

// report #9
export const salesOrderBySaleman = {
  renderItem: (salesMan, item) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            paddingLeft: 15,
            flexDirection: 'row',
            backgroundColor: MainTheme.searchHeaderListItems,
            height: 50,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: hp(fontDefault)}} allowFontScaling={false}>
            {' '}
            ชื่อพนักงาน{' '}
            {salesMan && salesMan.SLMN_NAME ? salesMan.SLMN_NAME : null}{' '}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              บิลเริ่มต้น
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {' '}
              {item && item.F_TIME ? item.F_TIME : null}{' '}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              บิลสุดท้าย
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {' '}
              {item && item.E_TIME ? item.E_TIME : null}{' '}
            </Text>
          </View>

          <View style={{borderTopWidth: 1, marginHorizontal: 5}}></View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: 18, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ยอดจองรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_AMT
                ? item.BOOK.SUM_AMT
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดต่อรายการรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_ITEM_DSC
                ? item.BOOK.SUM_ITEM_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดท้ายบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_BILL_DSC
                ? item.BOOK.SUM_BILL_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.COUNT_DOC
                ? item.BOOK.COUNT_DOC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนรายการจอง
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_PCS
                ? item.BOOK.SUM_PCS
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้นรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_QTY
                ? item.BOOK.SUM_QTY
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้น (แถม) รวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.BOOK && item.BOOK.SUM_FREE_ITEM_QTY
                ? item.BOOK.SUM_FREE_ITEM_QTY
                : null}
            </Text>
          </View>

          <View style={{borderTopWidth: 1, marginHorizontal: 5}}></View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ยอดขายรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_AMT
                ? item.SELL.SUM_AMT
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดต่อรายการรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_ITEM_DSC
                ? item.SELL.SUM_ITEM_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดท้ายบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_BILL_DSC
                ? item.SELL.SUM_BILL_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.COUNT_DOC
                ? item.SELL.COUNT_DOC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนรายการขาย
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_PCS
                ? item.SELL.SUM_PCS
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้นรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_QTY
                ? item.SELL.SUM_QTY
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้น (แถม) รวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SELL && item.SELL.SUM_FREE_ITEM_QTY
                ? item.SELL.SUM_FREE_ITEM_QTY
                : null}
            </Text>
          </View>

          <View style={{borderTopWidth: 1, marginHorizontal: 5}}></View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ยอดคืนรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_AMT
                ? item.RETURN.SUM_AMT
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดต่อรายการรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_ITEM_DSC
                ? item.RETURN.SUM_ITEM_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ส่วนลดท้ายบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_BILL_DSC
                ? item.RETURN.SUM_BILL_DSC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนบิลรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.COUNT_DOC
                ? item.RETURN.COUNT_DOC
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนรายการคืน
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_PCS
                ? item.RETURN.SUM_PCS
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้นรวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_QTY
                ? item.RETURN.SUM_QTY
                : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              จำนวนชิ้น (แถม) รวม
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.RETURN && item.RETURN.SUM_FREE_ITEM_QTY
                ? item.RETURN.SUM_FREE_ITEM_QTY
                : null}
            </Text>
          </View>

          <View style={{borderTopWidth: 1, marginHorizontal: 5}}></View>

          {/* <View style={{ flexDirection: 'row', height: 40, paddingHorizontal: 15, alignItems: 'center'}}>
                        <Text style={{flex: 0.5, fontSize: 18}}>ราคาลดตามจำนวน</Text>
                        <Text style={{flex: 0.5, textAlign: 'right', fontSize: 18}}> {item && item.SUM_AMT ? item.SUM_AMT : null} </Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: 40, paddingHorizontal: 15, alignItems: 'center'}}>
                        <Text style={{flex: 0.5, fontSize: 18}}>ซื้อจำนวนครบได้แถม</Text>
                        <Text style={{flex: 0.5, textAlign: 'right', fontSize: 18}}> {item && item.SUM_AMT ? item.SUM_AMT : null} </Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: 40, paddingHorizontal: 15, alignItems: 'center'}}>
                        <Text style={{flex: 0.5, fontSize: 18}}>ซื้อทดแทนครบได้แถม</Text>
                        <Text style={{flex: 0.5, textAlign: 'right', fontSize: 18}}> {item && item.SUM_AMT ? item.SUM_AMT : null} </Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: 40, paddingHorizontal: 15, alignItems: 'center'}}>
                        <Text style={{flex: 0.5, fontSize: 18}}>ซื้อทดแทนครบได้แถมตามจำนวน</Text>
                        <Text style={{flex: 0.5, textAlign: 'right', fontSize: 18}}> {item && item.SUM_AMT ? item.SUM_AMT : null} </Text>
                    </View>

                    <View style={{ borderTopWidth: 1, marginHorizontal: 5 }}></View> */}

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              โอนเข้าลูกหนี้
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.TRANSFER_TO_AR ? item.TRANSFER_TO_AR : null}
            </Text>
          </View>

          {/* transfer is locked  */}

          {/* <View style={{ flexDirection: 'row', height: 40, paddingHorizontal: 15, alignItems: 'center'}}>
                        <Text style={{ flex: 0.5, fontSize: hp(fontDefault) }} allowFontScaling={false} >โอนธนาคาร</Text>
                        <Text style={{ flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault) }} allowFontScaling={false} > 
                            {item && item.PAID_BY_TRANSFER ? item.PAID_BY_TRANSFER : null} 
                        </Text>
                    </View> */}

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ชำระเช็ค
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.PAID_BY_CHEQUE ? item.PAID_BY_CHEQUE : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              ชำระเงินสด
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.PAID_BY_CASH ? item.PAID_BY_CASH : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              คืนเงินสด
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.SUM_CASH_RTN ? item.SUM_CASH_RTN : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              เงินสดจากการขาย
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.CASH_FROM_SELL ? item.CASH_FROM_SELL : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              เศษทอนไม่ได้
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.PGL ? item.PGL : null}
            </Text>
          </View>

          <View style={{borderTopWidth: 1, marginHorizontal: 5}}></View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              เลขไมล์ เริ่มต้น
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.MILE_START ? item.MILE_START : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              เลขไมล์ สิ้นสุด
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.MILE_END ? item.MILE_END : null}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingHorizontal: 15,
              alignItems: 'center',
              marginBottom: 30,
            }}>
            <Text
              style={{flex: 0.5, fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              รวมระยะทาง(วิ่ง)
            </Text>
            <Text
              style={{flex: 0.5, textAlign: 'right', fontSize: hp(fontDefault)}}
              allowFontScaling={false}>
              {item && item.DISTANCE ? item.DISTANCE : null}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  },
};

// report #10
export const stockBalanceByWL = {
  header: () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
                textAlign: 'right',
              }}
              allowFontScaling={false}>
              จำนวน หน่วย
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
                textAlign: 'right',
              }}
              allowFontScaling={false}>
              จำนวน หน่วย
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
                textAlign: 'right',
              }}
              allowFontScaling={false}>
              จำนวน หน่วย
            </Text>
            <Text
              style={{
                flex: 1,
                color: MainTheme.colorSecondary,
                fontSize: hp(fontDefault),
                textAlign: 'right',
              }}
              allowFontScaling={false}>
              จำนวนค้างส่ง
            </Text>
            {/* <Text style={{ width: 120, textAlign: 'right', color: MainTheme.colorSecondary, fontSize: hp(fontDefault) }} allowFontScaling={false} >จำนวนคงเหลือ</Text>
                        <Text style={{ width: 120, textAlign: 'right', color: MainTheme.colorSecondary, fontSize: hp(fontDefault) }} allowFontScaling={false} >จำนวนค้างส่ง</Text> */}
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorQuinary}}
        titleNumberOfLines={1}
      />
    );
  },
  renderItem: ({item}) => {
    return (
      <ListItem
        title={
          <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: MainTheme.colorSeptenary,
                padding: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: MainTheme.colorQuaternary,
                  fontSize: hp(fontDefault),
                }}
                allowFontScaling={false}>
                {item.WL_CODE} {item.WL_NAME}
              </Text>
            </View>

            {item.ITEMS.map((row, i) => {
              let col1 =
                row.WL_QTY_S !== 0 && row.SKU_S_UTQ_NAME !== row.SKU_T_UTQ_NAME
                  ? row.WL_QTY_S.toFixed(0).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    ) +
                    ' ' +
                    row.SKU_S_UTQ_NAME
                  : null;
              let col2 =
                row.WL_QTY_T !== 0 && row.SKU_T_UTQ_NAME !== row.SKU_K_UTQ_NAME
                  ? row.WL_QTY_T.toFixed(0).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    ) +
                    ' ' +
                    row.SKU_T_UTQ_NAME
                  : null;
              let col3 =
                row.WL_QTY_K !== 0
                  ? row.WL_QTY_K.toFixed(0).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    ) +
                    ' ' +
                    row.SKU_K_UTQ_NAME
                  : null;

              if (col2 !== null && col3 === null) {
                col3 = col2;
                col2 = null;
              }

              if (col1 !== null && col2 === null && col3 === null) {
                col3 = col1;
                col1 = null;
              } else if (col1 !== null && col2 === null && col3 !== null) {
                col2 = col1;
                col1 = null;
              }

              if (col3 === null) {
                col3 =
                  row.WL_QTY_K.toFixed(0).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                  ) +
                  ' ' +
                  row.SKU_K_UTQ_NAME;
              }

              return (
                <View key={i}>
                  <View style={{flexDirection: 'row', padding: 15}}>
                    <Text
                      style={{flex: 1, fontSize: hp(fontDefault)}}
                      allowFontScaling={false}>
                      {row.SKU_CODE} : {row.SKU_NAME}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', padding: 15}}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: hp(fontDefault),
                        textAlign: 'right',
                      }}
                      allowFontScaling={false}>
                      {col1}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: hp(fontDefault),
                        textAlign: 'right',
                      }}
                      allowFontScaling={false}>
                      {col2}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: hp(fontDefault),
                        textAlign: 'right',
                      }}
                      allowFontScaling={false}>
                      {col3}
                    </Text>

                    <Text
                      style={{
                        flex: 1,
                        fontSize: hp(fontDefault),
                        textAlign: 'right',
                      }}
                      allowFontScaling={false}>
                      {row.TRD_NX_QTY !== 0
                        ? row.TRD_NX_QTY + ' ' + row.SKU_K_UTQ_NAME
                        : null}
                    </Text>
                  </View>
                </View>
              );
            })}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E5E4E2',
                padding: 15,
              }}>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_WL_QTY_S}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_WL_QTY_T}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_WL_QTY_K}
              </Text>
              <Text
                style={{flex: 1, textAlign: 'right', fontSize: hp(fontDefault)}}
                allowFontScaling={false}>
                {item.SUM_TRD_NX_QTY !== 0 ? item.SUM_TRD_NX_QTY : null}
              </Text>
            </View>
          </View>
        }
        containerStyle={[{padding: 0}, mainDivider]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  },
  footer: (item) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: MainTheme.colorThirteendary,
          padding: 15,
        }}>
        <Text
          style={{
            flex: 1,
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.GROUP_COUNT} รวมทั้งสิ้น{' '}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ALL_WL_QTY}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: MainTheme.colorFourteendary,
            fontSize: hp(fontDefault),
          }}
          allowFontScaling={false}>
          {item.SUM_ALL_TRD_NX_QTY}
        </Text>
      </View>
    );
  },
  horizontalScreen: 'none',
  footerSummary: false,
};
