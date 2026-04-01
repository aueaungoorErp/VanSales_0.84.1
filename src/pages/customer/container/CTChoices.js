import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getUserToken } from '../../../../src/utils/Token';
import { ListItem } from '../../../component/elements';
import { customerChoices, MainTheme } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import Choices from '../presenter/Choices';

class CTChoices extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userToken: {
        VANCONFIG: {
          VANCNF_AR_CREATE: null,
        },
      },
      customerChoices: [],
    };
  }

  componentDidMount = async (props) => {
    this._isMounted = true;
    await this._getUserToken();
    // console.log(customerChoices[1]);
    await this._setState('customerChoices', customerChoices);
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _header = () => {
    return (
      <ListItem
        title={
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerEyebrow} allowFontScaling={false}>CUSTOMER</Text>
            <Text style={styles.headerTitle} allowFontScaling={false}>ลูกค้า</Text>
          </View>
        }
        containerStyle={styles.headerCard}
        leftIcon={{
          name: 'user',
          type: 'ant-design',
          color: MainTheme.colorPrimary,
          size: 24,
        }}
        hideChevron
        bottomDivider></ListItem>
    );
  };

  _renderItem = ({item}, key) => {
    return (
      <ListItem
        key={key}
        title={
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle} allowFontScaling={false}>
              {item.title}
            </Text>
          </View>
        }
        leftIcon={{
          name: item.iconName,
          type: item.iconType,
          color: item.iconStyle?.color || MainTheme.colorPrimary,
          size: item.size || 24,
        }}
        onPress={() => this._onPress(item)}
        containerStyle={styles.itemCard}></ListItem>
    );
  };

  _onPress = async (item) => {
    if (item.methodType === 'new-page') {
      Navigator.navigate(item.screen);
    }
  };

  render() {
    return (
      <Choices
        header={this._header}
        listItems={this.state.customerChoices}
        renderItem={this._renderItem}
      />
    );
  }
}

export default CTChoices;

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#EAF6EF',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#D6EAD9',
  },
  headerTextWrap: {
    flexDirection: 'column',
  },
  headerEyebrow: {
    fontSize: hp('1.35%'),
    color: '#6A8D76',
    fontWeight: '700',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: hp('2.15%'),
    color: '#1F3B2F',
    fontWeight: '700',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E4E8EC',
  },
  itemTextWrap: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: hp('1.85%'),
    color: '#22312B',
    fontWeight: '700',
  },
});
