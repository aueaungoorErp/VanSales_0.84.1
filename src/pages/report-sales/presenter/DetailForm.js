import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ITextInputWithLabel from '../../../component/input/ITextInputWithLabel';
import ITextWithLabel from '../../../component/text/ITextWithLabel';

const Detail = (props) => {
  const {data} = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>แสดงยอดขายเดือนปี</Text>

      <View style={styles.detailSection}>
        <View style={styles.sectionInline}>
          <ITextInputWithLabel
            value="ยอดเงิน"
            style={iTextInputStylesHead}
            editable={false}
          />

          <ITextInputWithLabel
            value="เปอร์เซ็นต์"
            style={iTextInputWithoutLabelStylesHead}
            editable={false}
          />
        </View>

        <View style={styles.sectionInline}>
          <ITextInputWithLabel
            label="เป้าเดือน"
            value={data && data.MONTH_TARGET ? data.MONTH_TARGET : null}
            style={iTextInputStyles}
            editable={false}
          />

          <ITextInputWithLabel
            value={
              data && data.MONTH_TARGET_PERCENT
                ? data.MONTH_TARGET_PERCENT
                : null
            }
            style={iTextInputWithoutLabelStyles}
            editable={false}
          />
        </View>

        <View style={styles.sectionInline}>
          <ITextInputWithLabel
            label="ยอดสะสม"
            value={data && data.CUMULATIVE ? data.CUMULATIVE : null}
            style={iTextInputStyles}
            editable={false}
          />

          <ITextInputWithLabel
            value={
              data && data.CUMULATIVE_PERCENT ? data.CUMULATIVE_PERCENT : null
            }
            style={iTextInputWithoutLabelStyles}
            editable={false}
          />
        </View>

        <View style={styles.sectionInline}>
          <ITextInputWithLabel
            label="ยอดวันนี้"
            value={data && data.TODAY_SALE ? data.TODAY_SALE : null}
            style={iTextInputStyles}
            editable={false}
          />

          <ITextInputWithLabel
            value={
              data && data.TODAY_SALE_PERCENT ? data.TODAY_SALE_PERCENT : null
            }
            style={iTextInputWithoutLabelStyles}
            editable={false}
          />
        </View>

        <View style={styles.sectionInline}>
          <ITextInputWithLabel
            label="สูง/ต่ำกว่าเป้า"
            value={data && data.MAX_MIN_TARGET ? data.MAX_MIN_TARGET : null}
            style={iTextInputStyles}
            editable={false}
          />

          <ITextInputWithLabel
            value={
              data && data.MAX_MIN_TARGET_PERCENT
                ? data.MAX_MIN_TARGET_PERCENT
                : null
            }
            style={iTextInputWithoutLabelStyles}
            editable={false}
          />
        </View>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {},
  title: {
    marginBottom: 5,
  },
  detailSection: {
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
  },
  sectionInline: {
    height: 50,
    flexDirection: 'row',
  },
});

const iTextInputStyles = StyleSheet.create({
  container: {
    flex: 0.7,
  },
  label: {
    flex: 0.4,
  },
  textInput: {
    flex: 0.6,
    color: '#025464',
    textAlign: 'right',
  },
});

const iTextInputWithoutLabelStyles = StyleSheet.create({
  container: {
    flex: 0.5,
  },
  text: {
    flex: 0.05,
  },
  textInput: {
    flex: 0.95,
    color: '#025464',
    textAlign: 'right',
  },
});

const iTextInputStylesHead = StyleSheet.create({
  container: {
    flex: 0.7,
  },
  label: {
    flex: 0.4,
  },
  textInput: {
    flex: 0.6,
      color: '#E55807',
      textAlign: 'right',
      fontWeight: 'bold'
  },
});



const iTextInputWithoutLabelStylesHead = StyleSheet.create({
  container: {
    flex: 0.5,
  },
  text: {
    flex: 0.05,
  },
  textInput: {
    flex: 0.95,
      color: '#E55807',
      textAlign: 'right',
      fontWeight: 'bold'
  },
});
