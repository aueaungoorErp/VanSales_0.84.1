import React from 'react';
import { Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Navigator from '../../../services/Navigator';

const Icon = ({style, ...props}) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style || {};
  return (
    <MaterialIcons
      {...props}
      style={style}
      size={flattenedStyle.fontSize || 24}
      color={flattenedStyle.color || '#000000'}
    />
  );
};

const Content = ({children}) => <View>{children}</View>;

const Accordion = ({dataArray = [], renderHeader, renderContent}) => {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  return (
    <View>
      {dataArray.map((item, index) => {
        const expanded = expandedIndex === index;

        return (
          <View key={index}>
            <Text onPress={() => setExpandedIndex(expanded ? null : index)}>
              {renderHeader ? renderHeader(item, expanded) : null}
            </Text>
            {expanded && renderContent ? renderContent(item) : null}
          </View>
        );
      })}
    </View>
  );
};

const CTListItems = () => {
  const _renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#e3f1f1',
        }}>
        <View style={{flex: 0.95}}>
          <Text>{item.title}</Text>
        </View>
        {expanded ? (
          <Icon style={{flex: 0.05, fontSize: 18}} name="remove-circle" />
        ) : (
          <Icon style={{flex: 0.05, fontSize: 18}} name="add-circle" />
        )}
      </View>
    );
  };

  const _renderContent = (item) => {
    return (
      <View
        style={{
          backgroundColor: '#A9DAD6',
          padding: 10,
          fontStyle: 'italic',
        }}>
        <Text>{item.content}</Text>
      </View>
    );
  };

  const _listItems = [
    {
      title: (
        <Text
          style={{fontSize: hp('1.5%'), lineHeight: 30}}
          allowFontScaling={false}>
          โปรแกรมรองรับส่วนลดอะไรบ้าง
        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ  รองรับส่วนลดต่อรายการ 2 รูปแบบ        
          {'\r\n'}-	ส่วนลดต่อรายการ  เป็นส่วนลดบาทต่อชิ้น
          {'\r\n'}-	ส่วนลดท้ายบิล  สามารถเลือกได้ 2 รูปแบบ เป็นส่วนลดบาทหรือส่วนลด % ลดได้ 2 ขั้น

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          หากต้องการกำหนดเป้าขายรวมพนักงานหลายๆท่าน ตามเขตการขายสามารถทำได้หรือไม่

        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ สามารถทำได้ โดยสร้างพนักงานขายเป็นชื่อเขตการขายแล้วให้หน่วยรถเลือกเป็นพนักงานเดียวกัน
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ขั้นตอนการตั้งค่า แสดงลูกค้าตามสายลูกค้าต้องทำอย่างไร

        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ     {'\r\n'}- หัวข้อการตั้งค่าหน่วยรถ ช่องจำกัดรหัสลูกค้าให้เลือกเป็นตามสายลูกค้า
          {'\r\n'}-	หัวข้อสายลูกค้าที่ได้รับมอบมาย ให้เข้าไปเลือกสายลูกค้าที่ต้องการ

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ขั้นตอนการตั้งค่า แสดงลูกค้าตามยี่ห้อต้องทำอย่างไร
        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ    {'\r\n'}-  หัวข้อการตั้งค่าหน่วยรถ จำกัดรหัสสินค้าให้เลือกเป็นตามยี่ห้อสินค้า
          {'\r\n'}-	 หัวข้อยี่ห้อสินค้าที่ได้รับมอบหมาย ให้เลือกยี่ห้อที่ต้องการ

        
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ก่อนการใช้งานโปรแกรม Vansales On Mobile ควรตั้งค่าอะไรบ้าง
        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ     {'\r\n'}-    กำหนดสายลูกค้า
          {'\r\n'}-	กำหนดประเภทลูกค้า
          {'\r\n'}-	กำหนดยี่ห้อสินค้า
          {'\r\n'}-	กำหนดประเภทสินค้า
          {'\r\n'}-	กำหนดประเภทเอกสาร
          {'\r\n'}-	กำหนดตำแหน่งเก็บ
          {'\r\n'}-	สร้างชุดแบบสำรวจและการเยี่ยม
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>

          โปรแกรมสามารถสร้างเอกสารใดได้บ้าง

        </Text>
      ),
      content: (
        <>
          <Text
            style={{fontSize: hp('1.7%'), lineHeight: 30}}
            allowFontScaling={false}>
            ตอบ     6 เอกสาร ได้แก่ ใบเสนอราคา,ใบจองสินค้า,ใบขายสด,ใบขายเชื่อ,ใบรับคืนเชื่อ,ใบโอนย้ายสินค้า
          </Text>

        </>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ต้องการกำหนดชื่อเอกสารแต่ละเอกสารได้หรือไม่
        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ  สามารถทำได้ โดยกำหนดที่หัวข้อตั้งค่าหน่วยรถ แถบรูปแบบฟอร์ม
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          กำหนดระยะเช็คอินห่างจากพิกัดลูกค้าได้สูงสุดระยะทางเท่าใด
        </Text>
      ),
      content: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          ตอบ ไม่เกินระยะ 300 เมตร
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{fontSize: hp('1.7%'), lineHeight: 30}}
          allowFontScaling={false}>
          กรณีเลือกสินค้าเรียบร้อยแล้ว สาเหตุใดจึงไม่สามารถเลือกรายการสินค้าได้
        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ เนื่องจากสินค้าไม่มีราคาขายตามตารางราคาขายของลูกค้ารายนั้น
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ต้องการตรวจสอบสต๊อกสินค้าสำนักงานใหญ่ด้วย ต้องตั้งค่าที่ไหน
        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ  {'\r\n'}-   ที่หัวข้อตั้งค่าหน่วยรถ แถบยอดสินค้าคงเหลือในรถ ให้เลือกเป็นแสดงยอดคงเหลือ
          {'\r\n'}-	  ที่หัวข้อจุดเติมสินค้าที่ได้รับมอบหมาย ให้ติ๊กตำแหน่งเก็บสำนักงานใหญ่และตำแหน่งเก็บตนเอง

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ต้องการให้หน่วยรถสามารถสร้างลูกค้าใหม่ได้เอง ต้องทำขั้นตอนใด
        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ต้องสร้างสายลูกค้ารหัส 99 เท่านั้น
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>




          ไม่มีอินเตอร์เนต สามารถใช้งานโปรแกรมได้หรือไม่




        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ไม่สามารถใช้งานได้ เนื่องจากโปรแกรมทำงานรูปแบบ Online เท่านั้น

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.5%'), lineHeight: 30 }}
          allowFontScaling={false}>
          บันทึกของแถมไม่ได้ต้องตั้งค่าที่ใด

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ที่หัวข้อตั้งค่าหน่วยรถ แถบราคาขายช่องบันทึกจำนวนแถมสินค้าเอง ให้เลือกเป็นสามารถบันทึกได้

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ต้องการให้หน่วยรถ ไม่ต้องการให้บันทึกเอกสารบางเอกสารต้องทำอย่างไร

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ที่หัวข้อตั้งค่าหน่วยรถ แถบรูปแบบฟอร์ม เอกสารไหนไม่ต้องการแสดงให้นำติ๊กถูกที่ช่องสามารถบันทึกออก

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ต้องการโอนสินค้าจากหน่วยรถเข้าสำนักงานใหญ่ได้หรือไม่

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ สามารถทำได้ ที่หน้าจอบันทึกให้เลือกตำแหน่งเก็บต้นทางเป็นหน่วยรถ ตำแหน่งเก็บปลายทางให้เลือกเป็นตำแหน่งเก็บของหน่วยรถ

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          หากต้องการบันทึกรายการสินค้าเหมือนการขายครั้งก่อนต้องทำอย่างไร

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ที่หน้าจอเลือกสินค้า ให้กดปุ่มล่าสุด

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          การพิมพ์เอกสาร สามารถทำได้กี่ รูปแบบ อะไรบ้าง

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ 2 รูปแบบ 1.พิมพ์เป็น PDF 2. พิมพ์ผ่านเครื่องปริ้นเตอร์

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          บันทึกเอกสารแล้ว สามารถยกเลิกหรือลบเอกสารได้หรือไม่

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ไม่สามารถทำได้ ต้องประสานงานลบหรือยกเลิกเอกสารที่โปรแกรมหลังร้านเท่านั้น

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          โปรแกรมสามารถเช็ควงเงินเครดิตก่อนทำการขายได้หรือไม่

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ สามารถทำได้ โดยตั้งค่าหน่วยรถแถบขายเกินวงเงินเครดิตเป็นไม่สามารถขายเกินวงเงินเครดิต

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          กรณีทำการขายสด สามารถตั้งค่ากรณีบันทึกจำนวนเงินที่เป็นส่วนต่างขาดเกินได้อย่างไรบ้าง

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ จำนวนเงินต้องขาดและเกินได้ไม่เกินมูลค่า 1 บาท
        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          บันทึกเอกสารเยี่ยมหรือสำรวจแล้วตรวจสอบได้ที่ใด

        </Text>
      ),
      content: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ตอบ ตรวจสอบจาก Google Form เท่านั้น

        </Text>
      ),
    },
    {
      title: (
        <Text
          style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
          allowFontScaling={false}>
          ต้องการทำแบบสำรวจ และการเยี่ยมลูกค้าได้ที่ใด

        </Text>
      ),
      content: (
        <>
          <Text
            style={{ fontSize: hp('1.7%'), lineHeight: 30 }}
            allowFontScaling={false}>
            ตอบ  ต้องเข้าไปสร้างใน Google From แล้วนำลิงค์ไปวางที่การตั้งค่าหน่วยรถ หัวข้อ URL สำรวจร้านค้าและ URL บันทึกการขาย
            {'\n'}
          </Text>
          <Image
            style={{
              width: 250,
              height: 220,
              alignSelf: 'flex-end',
             // marginHorizontal: 5,
            }}
            resizeMode="contain"
            source={require('../../../images/202602241.jpg')}
          />

        </>
      ),
    },

  ];

  const _onPress = async (item) => {
    Navigator.navigate('PDFPreview', item);
  };

  return (
    <Content>
      <Accordion
        dataArray={_listItems}
        animation={true}
        expanded={[0]}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        contentStyle={{ backgroundColor: '#FFFFFF' }}
      />
    </Content>
  );
};

export default CTListItems;
