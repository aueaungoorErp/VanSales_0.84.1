import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, ListItem } from '../../../component/elements';
import { MainTheme, storeChoiceListItems } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
import ListItems from '../presenter/ListItems';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
    };
    this._getUserToken();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _header = () => {
    return (
      <ListItem
        containerStyle={styles.headerCard}>
        <Image
          style={styles.headerImage}
          resizeMode="contain"
          source={require('../../../images/warehouse.png')}
        />
        <ListItem.Content>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerEyebrow} allowFontScaling={false}>
              WAREHOUSE
            </Text>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              คลังสินค้า
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              เลือกหมวดงานคลังที่ต้องการใช้งาน
            </Text>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _checkVanConfigBalance = () => {
    result = 2;
    this.state.userToken &&
    this.state.userToken.VANCONFIG &&
    this.state.userToken.VANCONFIG.VANCNF_NEED_BAL
      ? (result = this.state.userToken.VANCONFIG.VANCNF_NEED_BAL)
      : (result = 2);

    return result;
  };

  _renderItem = ({item}, key) => {
    return (
      <ListItem
        key={key}
        onPress={() => this._onPress(item)}
        containerStyle={styles.itemCard}>
        <View style={styles.itemIconWrap}>
          <Icon
            name={item.iconName}
            type={item.iconType}
            iconStyle={item.iconStyle}
            size={item.size}
          />
        </View>
        <ListItem.Content>
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle} allowFontScaling={false}>
              {item.title}
            </Text>
            <Text style={styles.itemSubtitle} allowFontScaling={false}>
              แตะเพื่อเปิดเมนูนี้
            </Text>
          </View>
        </ListItem.Content>
        <ListItem.Chevron color={MainTheme.colorPrimary} size={18} />
      </ListItem>
    );
  };

  _onPress = async (item) => {
    if (item.methodType === 'new-page') {

      if (item.screen == 'StockTransfer') {
        Navigator.navigate(item.screen, {isFirst: true});
      } else {
        Navigator.navigate(item.screen);
      }
    }
  };

  render() {
    let storeChoices = storeChoiceListItems;
    this._checkVanConfigBalance() == 1
      ? (storeChoices = storeChoiceListItems.filter(
          (value, index) => value.screen != 'StockDropPoint',
        ))
      : null;

    return (
      <ListItems
        header={this._header}
        listItems={storeChoices}
        renderItem={this._renderItem}
      />
    );
  }
}

export default CTListItems;

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
  headerImage: {
    width: 38,
    height: 38,
    alignSelf: 'center',
    marginRight: 12,
  },
  headerTextWrap: {
    flexDirection: 'column',
  },
  headerEyebrow: {
    fontSize: hp('1.35%'),
    color: '#6A8D76',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: hp('2.2%'),
    color: '#1F3B2F',
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: hp('1.55%'),
    color: '#587060',
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
  itemIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2FBF7',
    marginRight: 12,
  },
  itemTextWrap: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: hp('1.95%'),
    color: '#21312A',
    fontWeight: '700',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: hp('1.45%'),
    color: '#718076',
  },
});
