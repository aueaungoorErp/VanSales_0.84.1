import { ImageSourcePropType } from 'react-native';
import { strings } from '../../../locales/i18n';

export interface MenuItem {
  title: string;
  imgSrc: ImageSourcePropType;
  screen: string;
  methodType: string;
  methodName: string | null;
  buttonStyle: { backgroundColor: string };
  orderType?: string;
}

export const homeMenuList: MenuItem[] = [
  {
    title: 'ทำรายการ',
    buttonStyle: { backgroundColor: '#FF0000' },
    imgSrc: require('../../../images/Order.png'),
    screen: 'Order',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'คลังสินค้า',
    buttonStyle: { backgroundColor: '#B1FB17' },
    imgSrc: require('../../../images/warehouse.png'),
    screen: 'Stock',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'รายงานการขาย',
    buttonStyle: { backgroundColor: '#B6B6B4' },
    imgSrc: require('../../../images/Report.png'),
    screen: 'Report',
    orderType: 'check-stock',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'รายงานการขาย',
    buttonStyle: { backgroundColor: '#3BB9FF' },
    imgSrc: require('../../../images/Chart.png'),
    screen: 'ReportSales',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'ลูกค้า',
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../../../images/customer.png'),
    screen: 'Customer',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'ตั้งค่า',
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../../../images/Setting.png'),
    screen: 'Setting',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: 'ออกจากระบบ',
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../../../images/LogOut.png'),
    screen: 'Auth',
    methodType: 'function',
    methodName: 'logout',
  },
];
