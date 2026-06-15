import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MainTheme} from '../../../constant/lov';

type BlankReportViewProps = {
  title?: string;
};

const BlankReportView: React.FC<BlankReportViewProps> = ({title}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchPanel}>
        <View style={styles.titleRow}>
          <AntDesign name="file-text" size={22} color={MainTheme.colorPrimary} />
          <Text style={styles.title} allowFontScaling={false}>
            {title || 'รายงาน'}
          </Text>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel} allowFontScaling={false}>
              วันที่เริ่มต้น
            </Text>
          </View>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel} allowFontScaling={false}>
              วันที่สิ้นสุด
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contentPanel}>
        <View style={styles.tableHeader}>
          <View style={styles.headerCell} />
          <View style={styles.headerCellWide} />
          <View style={styles.headerCell} />
        </View>
        <View style={styles.emptyBody}>
          <AntDesign name="inbox" size={34} color="#A8B6AE" />
          <Text style={styles.emptyText} allowFontScaling={false}>
            ไม่พบข้อมูลรายงาน
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BlankReportView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },
  searchPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E9E5',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontSize: hp('2%'),
    fontWeight: '700',
    color: '#22312B',
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterBox: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE7E1',
    backgroundColor: '#F9FCFA',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterLabel: {
    fontSize: hp('1.65%'),
    color: '#718076',
  },
  contentPanel: {
    flex: 1,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E8E3',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  tableHeader: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6EF',
    paddingHorizontal: 12,
  },
  headerCell: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D0E4D8',
    marginRight: 10,
  },
  headerCellWide: {
    flex: 1.4,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D0E4D8',
    marginRight: 10,
  },
  emptyBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: hp('1.85%'),
    color: '#718076',
  },
});
