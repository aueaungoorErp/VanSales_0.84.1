import moment from 'moment';
import 'moment/locale/th';
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IOverlay from '../../component/modal/IOverlay';
import { MainTheme, monthItems } from '../../constant/lov';
import { toBuddhistYear } from '../../utils/Date';

const Item = ({ style, children }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {children}
  </View>
);

const Input = ({ style, ...props }) => (
  <TextInput
    {...props}
    style={[
      { flex: 1, color: '#000000', paddingVertical: 4, paddingHorizontal: 0 },
      style,
    ]}
  />
);

moment.locale('th');

class IDatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      day: moment().date(),
      month: moment().month(),
      year: moment().year(),
    };
  }

  componentDidMount = props => {
    this._setBeginState();
  };

  _setBeginState = async () => {
    const { value } = this.props;
    const parsedDate = value ? moment(value, 'DD/MM/YYYY') : moment();

    await this.setState({
      day: parsedDate.date(),
      month: parsedDate.month(),
      year: parsedDate.year(),
    });
  };

  _setState = async (key, value) => {
    await this.setState(oldState => {
      return {
        [key]: value,
      };
    });
  };

  _generateYearItems = () => {
    const currentYear = moment().year();
    const result = [];

    for (let year = currentYear - 30; year <= currentYear + 20; year++) {
      result.push(year);
    }

    return result;
  };

  _buildSelectorItems = (items, labelBuilder = item => item.toString()) =>
    items.map(item => ({
      key: item,
      label: labelBuilder(item),
    }));

  _generateDayItems = () => {
    const daysInMonth = moment({
      year: this.state.year,
      month: this.state.month,
    }).daysInMonth();

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  };

  _syncDayWithinMonth = async () => {
    const daysInMonth = moment({
      year: this.state.year,
      month: this.state.month,
    }).daysInMonth();

    if (this.state.day > daysInMonth) {
      await this._setState('day', daysInMonth);
    }
  };

  _generateOverlayStyle = () => {
    if (Dimensions.get('window').width > 460) {
      return {
        width: '100%',
        backgroundColor: 'rgba(18, 24, 21, 0.45)',
      };
    }

    return {
      width: '100%',
      borderWidth: 1,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: 'rgba(18, 24, 21, 0.45)',
    };
  };

  _onConfirm = async () => {
    const selectedDate = moment({
      year: this.state.year,
      month: this.state.month,
      date: this.state.day,
    });

    this.props.onDateChange &&
      this.props.onDateChange(selectedDate.format('DD/MM/YYYY'));
    await this._setState('visible', false);
  };

  _onCancel = async () => {
    await this._setBeginState();
    await this._setState('visible', false);
  };

  _openPicker = async () => {
    await this._setBeginState();
    await this._setState('visible', true);
  };

  _renderSelectField = ({ items, selectedKey, onChange, valueText }) => (
    <ModalSelector
      data={items}
      accessible={true}
      cancelButtonAccessibilityLabel={'ยกเลิก'}
      onChange={option => onChange(option.key)}
      keyExtractor={item => item.key.toString()}
      labelExtractor={item => item.label}
      optionTextStyle={styles.selectorOptionText}
      selectedItemTextStyle={styles.selectorSelectedItemText}
      optionContainerStyle={styles.selectorOptionContainer}
      overlayStyle={styles.selectorOverlay}
      cancelContainerStyle={styles.selectorCancelContainer}
      cancelText="ยกเลิก"
      selectedKey={selectedKey}
    >
      <View style={styles.selectField}>
        <Text style={styles.selectFieldText} allowFontScaling={false}>
          {valueText}
        </Text>
        <AntDesign name="down" size={16} color={MainTheme.colorPrimary} />
      </View>
    </ModalSelector>
  );

  render() {
    const {
      label,
      value,
      disabled,
      hideBorder,
      inputTextStyle,
      labelTextStyle,
      iconSize,
      overlayCardStyle,
      overlayChildrenWrapperStyle,
    } = this.props;
    const yearItems = this._buildSelectorItems(
      this._generateYearItems(),
      item => (item + 543).toString(),
    );
    const monthSelectorItems = this._buildSelectorItems(
      monthItems.thaimonthNamesShort.map((item, index) => ({
        index,
        label: item,
      })),
      item => item.label,
    ).map(item => ({
      key: item.key.index,
      label: item.label,
    }));
    const dayItems = this._buildSelectorItems(this._generateDayItems());

    return (
      <View>
        <Item
          style={{
            borderBottomColor: '#d6d7da',
            borderBottomWidth: hideBorder ? 0 : 0.5,
          }}
        >
          {label ? (
            <Text
              style={[{ fontSize: hp('1.7%') }, labelTextStyle]}
              allowFontScaling={false}
            >
              {' '}
              {label}{' '}
            </Text>
          ) : null}

          <Input
            editable={false}
            value={toBuddhistYear(value)}
            style={[{ fontSize: hp('1.7%') }, inputTextStyle]}
            allowFontScaling={false}
          />
          <AntDesign
            name="calendar"
            size={iconSize || 20}
            color={MainTheme.colorTertiary}
            onPress={() =>
              disabled === undefined || disabled === false
                ? this._openPicker()
                : null
            }
          />
        </Item>

        <IOverlay
          closeOnTouchOutside={true}
          visible={this.state.visible}
          containerStyle={this._generateOverlayStyle()}
          onClose={() => {
            this._setState('visible', false);
          }}
          childrenWrapperStyle={[
            { backgroundColor: 'transparent' },
            overlayChildrenWrapperStyle,
          ]}
        >
          <View style={[styles.overlayCard, overlayCardStyle]}>
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle} allowFontScaling={false}>
                เลือกวันที่
              </Text>
            </View>

            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                {this._renderSelectField({
                  items: dayItems,
                  selectedKey: this.state.day,
                  onChange: selectedDay => this._setState('day', selectedDay),
                  valueText: this.state.day.toString(),
                })}
              </View>

              <View style={styles.pickerColumn}>
                {this._renderSelectField({
                  items: monthSelectorItems,
                  selectedKey: this.state.month,
                  onChange: async selectedMonth => {
                    await this._setState('month', selectedMonth);
                    await this._syncDayWithinMonth();
                  },
                  valueText: monthItems.thaimonthNamesShort[this.state.month],
                })}
              </View>

              <View style={styles.pickerColumn}>
                {this._renderSelectField({
                  items: yearItems,
                  selectedKey: this.state.year,
                  onChange: async selectedYear => {
                    await this._setState('year', selectedYear);
                    await this._syncDayWithinMonth();
                  },
                  valueText: (this.state.year + 543).toString(),
                })}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this._onConfirm}
                style={[styles.actionButton, styles.confirmButton]}
              >
                <Text style={styles.confirmButtonText} allowFontScaling={false}>
                  ยืนยัน
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this._onCancel}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  ยกเลิก
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </IOverlay>
      </View>
    );
  }
}

export default IDatePicker;

const styles = StyleSheet.create({
  overlayCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlayHeader: {
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#355244',
  },
  pickerRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  selectField: {
    minHeight: 48,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#DEE9E3',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectFieldText: {
    color: '#22312B',
    fontSize: 15,
    fontWeight: '600',
  },
  selectorOptionContainer: {
    backgroundColor: '#F7FAF8',
  },
  selectorOverlay: {
    justifyContent: 'flex-start',
    paddingTop: hp('13%'),
    paddingHorizontal: 18,
    backgroundColor: 'rgba(18, 24, 21, 0.18)',
  },
  selectorCancelContainer: {
    paddingHorizontal: 18,
  },
  selectorOptionText: {
    color: '#6C8478',
    fontSize: 15,
  },
  selectorSelectedItemText: {
    color: '#22312B',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E4ECE7',
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: MainTheme.colorPrimary,
  },
  cancelButton: {
    backgroundColor: MainTheme.colorSecondary,
    borderLeftWidth: 1,
    borderLeftColor: '#E4ECE7',
  },
  confirmButtonText: {
    color: MainTheme.colorSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});
