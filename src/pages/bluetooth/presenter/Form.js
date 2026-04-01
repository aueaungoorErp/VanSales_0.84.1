import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BluetoothModels, MainTheme } from '../../../constant/lov';

const Form = (props) => {
  const {
    bluetooth,
    setModel,
    getBluetoothList,
    connect,
    disConnect,
    testPrinter,
    clearAll,
    setState,
    printingType,
    setPrintingType,
  } = props;

  const isConnected = bluetooth.state === 'connected';

  return (
    <View style={styles.container}>
      {/* Print Mode Selection */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AntDesign name="printer" size={16} color={MainTheme.colorSecondary} />
          <Text style={styles.cardHeaderText}>เลือกรูปแบบการพิมพ์</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.modeRow}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setPrintingType('PDF')} activeOpacity={0.7}>
              <AntDesign name={printingType !== 'BLUETOOTH' ? 'checksquare' : 'checksquareo'} size={20} color={printingType !== 'BLUETOOTH' ? MainTheme.colorTertiary : '#ccc'} style={{marginRight: 8}} />
              <Text style={styles.checkboxText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setPrintingType('BLUETOOTH')} activeOpacity={0.7}>
              <AntDesign name={printingType === 'BLUETOOTH' ? 'checksquare' : 'checksquareo'} size={20} color={printingType === 'BLUETOOTH' ? MainTheme.colorTertiary : '#ccc'} style={{marginRight: 8}} />
              <Text style={styles.checkboxText}>Printer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {printingType === 'BLUETOOTH' ? (
        <View>
          {/* Device Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AntDesign name="scan1" size={16} color={MainTheme.colorSecondary} />
              <Text style={styles.cardHeaderText}>ข้อมูลอุปกรณ์</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.fieldRow}>
                <View style={styles.fieldLabel}>
                  <AntDesign name="mobile1" size={14} color={MainTheme.colorQuaternary} />
                  <Text style={styles.fieldLabelText}>ชื่อบลูทูธ</Text>
                </View>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldValueText}>
                    {bluetooth.item.name || '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldLabel}>
                  <AntDesign name="wifi" size={14} color={MainTheme.colorQuaternary} />
                  <Text style={styles.fieldLabelText}>แอดเดรส</Text>
                </View>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldValueText}>
                    {bluetooth.item.address || '-'}
                  </Text>
                </View>
              </View>

              {/* Status indicator */}
              <View style={styles.statusRow}>
                <AntDesign
                  name={isConnected ? 'checkcircle' : 'closecircle'}
                  size={14}
                  color={isConnected ? MainTheme.colorSuccess : MainTheme.colorDanger}
                />
                <Text style={[
                  styles.statusText,
                  {color: isConnected ? MainTheme.colorTertiary : '#999'}
                ]}>
                  {isConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
                </Text>
              </View>
            </View>
          </View>

          {/* Printer Model Card */}
          <View style={[styles.card , ]}>
            <View style={styles.cardHeader}>
              <AntDesign name="setting" size={16} color={MainTheme.colorSecondary} />
              <Text style={styles.cardHeaderText}>เลือกรุ่นปริ้นเตอร์</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.modelHint}>เลือกได้ 1 รุ่น</Text>
              <View style={styles.modelPickerContainer}>
                <RNPickerSelect
                  onValueChange={(model) => setModel(model)}
                  items={BluetoothModels.items}
                  value={bluetooth.model}
                  disabled={isConnected}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                    label: 'เลือกรุ่นปริ้นเตอร์',
                    value: null,
                  }}
                  style={{
                    inputAndroid: styles.modelPickerInput,
                    inputIOS: styles.modelPickerInput,
                    iconContainer: styles.modelPickerIconContainer,
                    placeholder: {
                      color: '#98A2B3',
                    },
                  }}
                  Icon={() => (
                    <AntDesign
                      name="down"
                      size={18}
                      color={isConnected ? '#98A2B3' : MainTheme.colorPrimary}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AntDesign name="appstore-o" size={16} color={MainTheme.colorSecondary} />
              <Text style={styles.cardHeaderText}>การจัดการ</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: isConnected ? MainTheme.colorNonary : MainTheme.colorPrimary}, styles.actionBtnContainer]}
                  onPress={() => connect()}
                  disabled={isConnected}
                  activeOpacity={0.7}>
                  <AntDesign name="link" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.actionBtnTitle}>เชื่อมต่อ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: !isConnected ? MainTheme.colorNonary : '#E74C3C'}, styles.actionBtnContainer]}
                  onPress={() => disConnect()}
                  disabled={!isConnected}
                  activeOpacity={0.7}>
                  <AntDesign name="disconnect" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.actionBtnTitle}>ยกเลิก</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: !isConnected ? MainTheme.colorNonary : '#3498DB'}, styles.actionBtnContainer]}
                  onPress={() => testPrinter()}
                  disabled={!isConnected}
                  activeOpacity={0.7}>
                  <AntDesign name="printer" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.actionBtnTitle}>ทดสอบพิมพ์</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: '#F39C12'}, styles.actionBtnContainer]}
                  onPress={() => getBluetoothList()}
                  activeOpacity={0.7}>
                  <AntDesign name="sync" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.actionBtnTitle}>รีเฟรช</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.actionBtn, {backgroundColor: isConnected ? MainTheme.colorNonary : '#fff', borderWidth: 1, borderColor: '#E74C3C'}, {marginTop: 8}]}
                onPress={() => clearAll()}
                disabled={isConnected}
                activeOpacity={0.7}>
                <AntDesign name="delete" size={18} color="#E74C3C" style={{marginRight: 8}} />
                <Text style={[styles.actionBtnTitle, {color: '#E74C3C'}]}>ล้างข้อมูลทั้งหมด</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ProgressDialog
            visible={bluetooth.state === 'connecting'}
            message={bluetooth.state !== null ? bluetooth.state : ''}
            animationType={'fade'}
            dialogStyle={{borderRadius: 5}}
          />

          <ConfirmDialog
            title="เกิดข้อผิดพลาด"
            visible={bluetooth.state === 'connect failed'}
            positiveButton={{
              title: 'ตกลง',
              titleStyle: {color: '#000000'},
              onPress: () => setState(null),
            }}
            animationType={'fade'}
            dialogStyle={{borderRadius: 5}}>
            <View>
              <Text>{bluetooth.state !== null ? bluetooth.state : ''}</Text>
            </View>
          </ConfirmDialog>
        </View>
      ) : null}
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6F8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MainTheme.colorPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardHeaderText: {
    color: MainTheme.colorSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingVertical: 4,
    marginLeft: 0,
    marginRight: 16,
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '400',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fieldLabel: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabelText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginLeft: 6,
  },
  fieldValue: {
    flex: 0.65,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E4E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fieldValueText: {
    fontSize: 14,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
  },
  statusText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  buttonCard: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  buttonContainer: {
    flex: 1,
  },
  modelHint: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  modelPickerContainer: {
    borderWidth: 1,
    borderColor: '#D9E1E7',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    justifyContent: 'center',
    minHeight: 48,
  },
  modelPickerInput: {
    color: '#344054',
    fontSize: 14,
    paddingVertical: 12,
    paddingRight: 28,
  },
  modelPickerIconContainer: {
    top: 14,
    right: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  actionBtnContainer: {
    flex: 1,
  },
  actionBtn: {
    height: 50,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    height: 48,
    borderRadius: 10,
    elevation: 2,
  },
  buttonTitle: {
    color: MainTheme.colorSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: MainTheme.colorNonary,
    borderRadius: 10,
  },
});

