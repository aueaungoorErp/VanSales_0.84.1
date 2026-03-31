import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import {
    campaignFindByCondition,
    setErrorMessage,
} from '../../../action/campaign';
import {
    campaignARCPGNTypeSearchList,
    setInitialState as setInitialCampaignARCPGNTypeState,
    setItem,
} from '../../../action/campaign-arcpgn-type';
import {
    campaignTypeSearchList,
    setInitialState,
    setItem as setcampaignTypeItem,
} from '../../../action/campaign-type';
import { ListItem } from '../../../component/elements';
import { MainTheme, mainDivider } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import ListItems from '../presenter/ListItems';

class CTListItems extends Component {
  _isMounted = false;
  _campaignCode = null;

  constructor(props) {
    super(props);

    this.state = {};

    const {routes, index} = Navigator.getCurrentRoute();
    this._campaignCode =
      routes[index].params && routes[index].params.campaignCode
        ? routes[index].params.campaignCode
        : null;
  }

  componentDidMount = async (props) => {
    this._isMounted = true;

    if (this._campaignCode !== null) {
      await this.props.setInitialCampaignARCPGNTypeState();
      await this.props.campaignARCPGNTypeSearchList(this._campaignCode);
    } else {
      await this.props.setInitialState();
      await this.props.campaignTypeSearchList();
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onItemPress = async (item) => {
    if (this._campaignCode !== null) {
      try {
        const result = await this.props.campaignFindByCondition({
          ARCPGN_TYPE: this._campaignCode,
          ARCPGN_CODE: item.ARCPGN_CODE,
        });

        if (result === '00') {
          await this.props.setItem(item);
          Navigator.navigate('CampaignDetail');
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      this.props.setcampaignTypeItem(item);
      Navigator.push('Campaign', {campaignCode: item.CPGNT_CODE});
    }
  };

  _onRefresh = () => {
    this.props.campaignTypeSearchList();
  };

  _onScroll = (event) => {};

  _actionHandler = () => {};

  _onReload = async () => {
    if (this._campaignCode !== null) {
      await this.props.setInitialCampaignARCPGNTypeState();
      await this.props.campaignARCPGNTypeSearchList(this._campaignCode);
    } else {
      await this.props.setInitialState();
      await this.props.campaignTypeSearchList();
    }
  };

  _header = () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'column'}}>
            <Text style>
              {this._campaignCode === null ? 'แคมเปญ' : 'แคมเปญย่อย'}
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
        leftIcon={
          <Image
            style={{width: 35, height: 35, alignSelf: 'center'}}
            resizeMode="contain"
            source={require('../../../images/warehouse.png')}
          />
        }
        bottomDivider></ListItem>
    );
  };

  _renderItem = ({item}) => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              {/* <Text>{item.CPGNT_CODE}</Text> */}
              <Text>
                {item.CPGNT_NAME ? item.CPGNT_NAME : item.ARCPGN_NAME}
              </Text>
            </View>
          </View>
        }
        hideChevron
        onPress={() => {
          this._onItemPress(item);
        }}
        containerStyle={mainDivider}
        bottomDivider
      />
    );
  };

  _renderARCPGNTypeItem = ({item}) => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              {/* <Text>{item.ARCPGN_CODE}</Text> */}
              <Text>{item.ARCPGN_NAME}</Text>
            </View>
          </View>
        }
        hideChevron
        onPress={() => {
          this._onItemPress(item);
        }}
        containerStyle={mainDivider}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <ListItems
        header={this._header}
        renderItem={
          this._campaignCode !== null
            ? this._renderARCPGNTypeItem
            : this._renderItem
        }
        listItems={
          this._campaignCode !== null
            ? this.props.campaignARCPGNType.listItems
            : this.props.campaignType.listItems
        }
        refreshing={
          this._campaignCode !== null
            ? this.props.campaignARCPGNType.isLoading
            : this.props.campaignType.isLoading
        }
        onRefresh={this._onRefresh}
        onScroll={this._onScroll}
        actionHandler={this._actionHandler}
        isNotFound={
          this._campaignCode !== null
            ? this.props.campaignARCPGNType.isNotFound
            : this.props.campaignType.isNotFound
        }
        errorMessage={
          this._campaignCode !== null
            ? this.props.campaignARCPGNType.errorMessage
            : this.props.campaignType.errorMessage
        }
        isError={
          this._campaignCode !== null
            ? this.props.campaignARCPGNType.isError
            : this.props.campaignType.isError
        }
        isSnackBarVisible={this.state.isSnackBarVisible}
        onButtonPress={this._onReload}
        isCampaignLoading={this.props.campaign.isLoading}
        campaignErrorMessage={this.props.campaign.errorMessage}
        setCampaignErrorMessage={this.props.setErrorMessage}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  campaign: state.campaign,
  campaignType: state.campaignType,
  campaignARCPGNType: state.campaignARCPGNType,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    setInitialCampaignARCPGNTypeState: () => {
      dispatch(setInitialCampaignARCPGNTypeState());
    },
    campaignTypeSearchList: () => {
      dispatch(campaignTypeSearchList());
    },
    campaignARCPGNTypeSearchList: (id) => {
      dispatch(campaignARCPGNTypeSearchList(id));
    },
    campaignFindByCondition: (request) =>
      dispatch(campaignFindByCondition(request)),
    setErrorMessage: (message) => {
      dispatch(setErrorMessage(message));
    },
    setItem: (item) => dispatch(setItem(item)),
    setcampaignTypeItem: (item) => dispatch(setcampaignTypeItem(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
