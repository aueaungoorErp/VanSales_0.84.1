import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';
import LoginHeader from './component/header/LoginHeader';
import MainHeader from './component/header/MainHeader';
import { APP_VERSION_FULL } from './constant/lov';
import { strings } from './locales/i18n';
import Splash from './pages/splash/screen/Index';
import { navigationRef } from './services/Navigator';

const RootStack = createStackNavigator();
const LoginStack = createStackNavigator();
const HomeStack = createStackNavigator();

const androidCardInterpolator = Platform.OS === 'android'
  ? CardStyleInterpolators.forHorizontalIOS
  : undefined;

const mainScreenOptions = {
  header: () => <MainHeader />,
  cardStyleInterpolator: androidCardInterpolator,
};

const loginScreenOptions = {
  header: () => <LoginHeader />,
  cardStyleInterpolator: androidCardInterpolator,
};

function LoginNavigator() {
  return (
    <LoginStack.Navigator
      initialRouteName="Login"
      screenOptions={loginScreenOptions}
    >
      <LoginStack.Screen
        name="Login"
        component={require('./pages/login/screen/Index').default}
        initialParams={{ title: 'เข้าสู่ระบบ' }}
      />
      <LoginStack.Screen
        name="LoginSetting"
        component={require('./pages/login/screen/Setting').default}
        initialParams={{ title: 'ตั้งค่าเว็ปเซอร์วิสและหน่วยรถ' }}
      />
      <LoginStack.Screen
        name="ServiceSetting"
        component={require('./pages/settingService').default}
        initialParams={{ title: 'จัดการเว็ปเซอร์วิส' }}
      />
    </LoginStack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={mainScreenOptions}
    >
      <HomeStack.Screen
        name="Home"
        component={require('./pages/home/screen/Index').default}
        initialParams={{ title: strings('setting.app_version', { version: APP_VERSION_FULL }) }}
      />
      <HomeStack.Screen name="QRCODE_KTB" component={require('./pages/ktb/QRCODE').default} initialParams={{ title: 'KTB QRCODE' }} />
      <HomeStack.Screen name="Bluetooth" component={require('./pages/bluetooth/screen/Index').default} initialParams={{ title: 'ตั้งค่าบลูทูธ' }} />
      <HomeStack.Screen name="Camera" component={require('./pages/camera/screen/Index').default} initialParams={{ title: 'กล้อง' }} />
      <HomeStack.Screen name="Campaign" component={require('./pages/campaign/screen/Index').default} initialParams={{ title: 'แคมเปญ' }} />
      <HomeStack.Screen name="CampaignDetail" component={require('./pages/campaign/screen/Detail').default} initialParams={{ title: 'รายละเอียดแคมเปญ' }} />
      <HomeStack.Screen name="CheckIn" component={require('./pages/check-in/screen/Index').default} initialParams={{ title: 'เช็คอิน' }} />
      <HomeStack.Screen name="Customer" component={require('./pages/customer/screen/Index').default} initialParams={{ title: 'ลูกค้า' }} />
      <HomeStack.Screen name="CustomerAdd" component={require('./pages/customer/screen/Add').default} initialParams={{ title: 'เพิ่มข้อมูลลูกค้า' }} />
      <HomeStack.Screen name="CustomerProfile" component={require('./pages/customer/screen/Profile').default} initialParams={{ title: 'ข้อมูลลูกค้า' }} />
      <HomeStack.Screen name="CustomerProfileDetail" component={require('./pages/customer/screen/ProfileDetail').default} initialParams={{ title: 'ข้อมูลลูกค้า' }} />
      <HomeStack.Screen name="CustomerRouteMap" component={require('./pages/customer/screen/RouteMap').default} initialParams={{ title: 'แผนที่ลูกค้า' }} />
      <HomeStack.Screen name="CustomerRouteMapLine" component={require('./pages/customer/screen/RouteMapLine').default} initialParams={{ title: 'แผนที่ลูกค้าตามสายลูกค้า' }} />
      <HomeStack.Screen name="CustomerRouteMapLine2" component={require('./pages/customer/screen/RouteMapLine').default} initialParams={{ title: 'แผนที่ลูกค้าตามสายเดินทาง' }} />
      <HomeStack.Screen name="CustomerDestination" component={require('./pages/customer/screen/Destination').default} initialParams={{ title: 'ลูกค้ารายถัดไป' }} />
      <HomeStack.Screen name="Mile" component={require('./pages/mile/screen/Index').default} initialParams={{ title: 'บันทึกเลขไมล์' }} />
      <HomeStack.Screen name="MileStartRunOut" component={require('./pages/mile-start-run-out/screen/Index').default} initialParams={{ title: 'บันทึกเลขไมล์' }} />
      <HomeStack.Screen name="Order" component={require('./pages/order/screen/Index').default} initialParams={{ title: 'ทำรายการ' }} />
      <HomeStack.Screen name="OrderBill" component={require('./pages/order/bill/screen/Index').default} initialParams={{ title: 'บิลเอกสาร' }} />
      <HomeStack.Screen name="OrderChoice" component={require('./pages/order/screen/Choice').default} initialParams={{ title: 'ทำรายการ' }} />
      <HomeStack.Screen name="OrderCheckStock" component={require('./pages/order/check-stock/screen/Index').default} initialParams={{ title: 'ใบเสนอราคา' }} />
      <HomeStack.Screen name="OrderCheckStockSummary" component={require('./pages/order/check-stock/screen/Summary').default} initialParams={{ title: 'ตรวจนับสินค้า' }} />
      <HomeStack.Screen name="OrderCheckStockImageItems" component={require('./pages/order/check-stock/screen/ImageItems').default} initialParams={{ title: 'ตรวจนับสินค้า - ถ่ายรูปสินค้า' }} />
      <HomeStack.Screen name="OrderCheckStockFinalize" component={require('./pages/order/check-stock/screen/Finalize').default} initialParams={{ title: 'ทำรายการ' }} />
      <HomeStack.Screen name="OrderOutstandingBalance" component={require('./pages/order/outstanding-balance/screen/Index').default} initialParams={{ title: 'ใบเสร็จรับเงิน' }} />
      <HomeStack.Screen name="OrderOutstandingBalanceKeyStep" component={require('./pages/order/outstanding-balance/key-step/screen/Index').default} initialParams={{ title: 'ใบเสร็จรับเงิน' }} />
      <HomeStack.Screen name="OrderOutstandingBalanceCreateStep" component={require('./pages/order/outstanding-balance/create-step/screen/Index').default} initialParams={{ title: 'ใบเสร็จรับเงิน' }} />
      <HomeStack.Screen name="OrderOutstandingBalanceSummaryStep" component={require('./pages/order/outstanding-balance/summary-step/screen/Index').default} initialParams={{ title: 'ใบเสร็จรับเงิน' }} />
      <HomeStack.Screen name="OrderSales" component={require('./pages/order/sales/screen/Index').default} initialParams={{ title: 'ทำรายการ' }} />
      <HomeStack.Screen name="OrderSalesFinalize" component={require('./pages/order/sales/screen/Finalize').default} initialParams={{ title: 'ทำรายการ' }} />
      <HomeStack.Screen name="OrderSalesPayment" component={require('./pages/order/sales/screen/Payment').default} initialParams={{ title: 'ชำระเงินสด' }} />
      <HomeStack.Screen name="OrderSalesSummary" component={require('./pages/order/sales/screen/Summary').default} initialParams={{ title: 'สรุปยอดทำรายการ' }} />
      <HomeStack.Screen name="OrderSurvey" component={require('./pages/order/survey/screen/Index').default} initialParams={{ title: 'สำรวจร้านค้า' }} />
      <HomeStack.Screen name="OrderVisit" component={require('./pages/order/visit/screen/Index').default} initialParams={{ title: 'เยี่ยมลูกค้า' }} />
      <HomeStack.Screen name="PDFPreview" component={require('./pages/pdf/screen/Index').default} initialParams={{ title: 'คู่มือการใช้งาน' }} />
      <HomeStack.Screen name="Manual" component={require('./pages/manual/screen/Index').default} initialParams={{ title: 'คู่มือการใช้งาน' }} />
      <HomeStack.Screen name="FAQ" component={require('./pages/faq/screen/Index').default} initialParams={{ title: 'คำถามที่พบบ่อย' }} />
      <HomeStack.Screen name="ProductAddTo" component={require('./pages/product/screen/AddTo').default} initialParams={{ title: 'เพิ่มสินค้า' }} />
      <HomeStack.Screen name="ProductEditTo" component={require('./pages/product/screen/EditTo').default} initialParams={{ title: 'แก้ไขสินค้า' }} />
      <HomeStack.Screen name="Report" component={require('./pages/report/screen/Index').default} initialParams={{ title: 'สรุปงาน' }} />
      <HomeStack.Screen name="Paperless" component={require('./pages/paperless/screen/Index').default} initialParams={{ title: 'รายงาน' }} />
      <HomeStack.Screen name="PaperlessSetting" component={require('./pages/paperless/screen/settingERP').default} initialParams={{ title: 'ตั้งค่าพิมพ์เอกสาร ERP' }} />
      <HomeStack.Screen name="ReportSummary" component={require('./pages/report/screen/Summary').default} initialParams={{ title: 'รายงานต่างๆ' }} />
      <HomeStack.Screen name="ReportSales" component={require('./pages/report-sales/screen/Index').default} initialParams={{ title: 'แสดงยอดขาย' }} />
      <HomeStack.Screen name="Setting" component={require('./pages/setting/screen/Index').default} initialParams={{ title: 'การตั้งค่า' }} />
      <HomeStack.Screen name="Stock" component={require('./pages/stock/screen/Index').default} initialParams={{ title: 'คลังสินค้า' }} />
      <HomeStack.Screen name="StockDropPoint" component={require('./pages/stock/screen/drop-point/Index').default} initialParams={{ title: 'สอบถามสินค้าคงเหลือ' }} />
      <HomeStack.Screen name="StockDropPointDetail" component={require('./pages/stock/screen/drop-point/Detail').default} initialParams={{ title: 'สอบถามสินค้าคงเหลือ' }} />
      <HomeStack.Screen name="StockTransfer" component={require('./pages/stock/screen/transfer/Index').default} initialParams={{ title: 'โอนย้ายสินค้า' }} />
      <HomeStack.Screen name="TransferGoods" component={require('./pages/stock/screen/transferGoods/Index').default} initialParams={{ title: 'โอนย้ายสินค้า' }} />
    </HomeStack.Navigator>
  );
}

class AppNavigator extends React.Component {
  render() {
    return (
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{ cardStyleInterpolator: androidCardInterpolator }}
        >
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Auth"
            component={LoginNavigator}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Main"
            component={HomeNavigator}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;