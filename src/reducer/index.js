import {combineReducers} from 'redux';
import {appState} from './appState';
import {campaign} from './campaign';
import {campaignType} from './campaign-type';
import {campaignARCPGNType} from './campaign-arcpgn-type';
import {network} from './network';
import {bill} from './bill';
import {bluetooth} from './bluetooth';
import {screen} from './screen';
import {user} from './user';
import {customer} from './customer';
import {customerType} from './customer-type';
import {product} from './product';
import {productCategory} from './product-category';
import {productSkuAlt} from './product-sku-alt';
import {order} from './order';
import {outstandingBalance} from './outstanding-balance';
import {geolocation} from './geolocation';
import {checkin} from './check-in';
import {mile} from './mile';
import {masterData} from './masterData';
import {dropPoint} from './drop-point';
import {report} from './report';

export default combineReducers({
  appState: appState,
  screen: screen,
  campaign: campaign,
  campaignType: campaignType,
  campaignARCPGNType: campaignARCPGNType,
  network: network,
  bill: bill,
  bluetooth: bluetooth,
  dropPoint: dropPoint,
  user: user,
  customer: customer,
  customerType: customerType,
  product: product,
  productCategory: productCategory,
  productSkuAlt: productSkuAlt,
  order: order,
  outstandingBalance: outstandingBalance,
  geolocation: geolocation,
  checkin: checkin,
  mile: mile,
  masterData: masterData,
  report: report,
});
