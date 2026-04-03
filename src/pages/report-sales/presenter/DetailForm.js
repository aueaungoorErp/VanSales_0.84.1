import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ITextInputWithLabel from '../../../component/input/ITextInputWithLabel';
import { MainTheme } from '../../../constant/lov';

const Detail = (props) => {
  const {data} = props;

  if (!data) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyBadge}>
            <AntDesign name="barschart" size={20} color={MainTheme.colorPrimary} />
          </View>
          <Text style={styles.emptyTitle} allowFontScaling={false}>ยังไม่มีข้อมูลยอดขาย</Text>
          <Text style={styles.emptySubtitle} allowFontScaling={false}>เลือกช่วงวันที่ด้านบน แล้วกดแสดงข้อมูลยอดขาย</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryHeaderCard}>
       
        <View style={styles.summaryHeaderCopy}>
          <Text style={styles.title} allowFontScaling={false}>แสดงยอดขายเดือน</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <View style={[styles.sectionInline, styles.tableHeaderRow]}>
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

        <View style={styles.dataRow}>
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

        <View style={styles.dataRowAlt}>
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

        <View style={styles.dataRow}>
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

        <View style={styles.dataRowAlt}>
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
  container: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    color: '#1F3B2F',
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryHeaderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF6EF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#D6EAD9',
    marginBottom: 12,
  },
  summaryHeaderBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MainTheme.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  summaryHeaderCopy: {
    flex: 1,
  },
  summaryEyebrow: {
    fontSize: 12,
    color: '#6A8D76',
    fontWeight: '700',
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#587060',
    lineHeight: 19,
  },
  detailSection: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E1EAE4',
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionInline: {
    height: 50,
    flexDirection: 'row',
  },
  tableHeaderRow: {
    backgroundColor: '#FFF3E8',
    borderRadius: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#F8FBF9',
    paddingHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  dataRowAlt: {
    flexDirection: 'row',
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF2EE',
    paddingHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1EAE4',
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F2FBF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23342C',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7D73',
    textAlign: 'center',
  },
});

const iTextInputStyles = StyleSheet.create({
  container: {
    flex: 0.7,
    paddingVertical: 4,
  },
  label: {
    flex: 0.4,
    justifyContent: 'center',
  },
  textInput: {
    flex: 0.6,
    color: '#025464',
    textAlign: 'right',
    fontWeight: '600',
  },
});

const iTextInputWithoutLabelStyles = StyleSheet.create({
  container: {
    flex: 0.5,
    paddingVertical: 4,
  },
  text: {
    flex: 0.05,
  },
  textInput: {
    flex: 0.95,
    color: '#025464',
    textAlign: 'right',
    fontWeight: '600',
  },
});

const iTextInputStylesHead = StyleSheet.create({
  container: {
    flex: 0.7,
    paddingVertical: 4,
  },
  label: {
    flex: 0.4,
    justifyContent: 'center',
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
    paddingVertical: 4,
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
