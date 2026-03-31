import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import IPickerSelectWithLabel from '../../component/input/IPickerSelectWithLabel'
import ITextInputWithLabel from '../../component/input/ITextInputWithLabel'
import { MainTheme } from '../../constant/'

const Form = (props) => {
    const { bluetooth, setModel, getBluetoothList, connect, disConnect, testPrinter, clearAll, setState } = props
    
    return (
        <View style={styles.container}>
            <View style={{ padding: 5 }}>
                <ITextInputWithLabel label='ชื่อบลูทูธ' value={bluetooth.item.name} editable={false}/>
                <ITextInputWithLabel label='แอดแดรส' value={bluetooth.item.address} editable={false} />
                
                <IPickerSelectWithLabel 
                    label='ปริ้นเตอร์' 
                    items={bluetooth.modelItems} 
                    value={bluetooth.model}
                    placeholder='เลือก' 
                    disabled={bluetooth.state === 'connected'} 
                    onValueChange={(model) => setModel(model)} />
            </View>
            <View style={iButtonGroupCustomStyles.container}>

                <TouchableOpacity
                    style={[{flex: 1, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: MainTheme.colorQuaternary, borderRightWidth: 0.3, borderColor: MainTheme.colorQuaternary}, bluetooth.state === 'connected' && {backgroundColor: MainTheme.colorNonary}]}
                    onPress={() => { connect() }}
                    disabled={bluetooth.state === 'connected'}
                    activeOpacity={0.7}>
                    <Text style={{color: MainTheme.colorSecondary}}>เชื่อมต่อ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{flex: 1, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: MainTheme.colorSeptenary, borderRightWidth: 0.3, borderColor: MainTheme.colorQuaternary}, bluetooth.state !== 'connected' && {backgroundColor: MainTheme.colorNonary}]}
                    onPress={() => { disConnect() }}
                    disabled={bluetooth.state !== 'connected'}
                    activeOpacity={0.7}>
                    <Text style={{color: MainTheme.colorSenary}}>ยกเลิก</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{flex: 1, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: MainTheme.colorSeptenary, borderRightWidth: 0.3, borderColor: MainTheme.colorQuaternary}, bluetooth.state !== 'connected' && {backgroundColor: MainTheme.colorNonary}]}
                    onPress={() => { testPrinter() }}
                    disabled={bluetooth.state !== 'connected'}
                    activeOpacity={0.7}>
                    <Text style={{color: MainTheme.colorSenary}}>พิมพ์</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{flex: 1, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: MainTheme.colorSeptenary, borderRightWidth: 0.3, borderColor: MainTheme.colorQuaternary}}
                    onPress={() => { getBluetoothList() }}
                    activeOpacity={0.7}>
                    <Text style={{color: MainTheme.colorSenary}}>รีเฟรช</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{flex: 1, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: MainTheme.colorSeptenary, borderRightWidth: 0.3, borderColor: MainTheme.colorQuaternary}, bluetooth.state === 'connected' && {backgroundColor: MainTheme.colorNonary}]}
                    disabled={bluetooth.state === 'connected'}
                    onPress={() => { clearAll() }}
                    activeOpacity={0.7}>
                    <Text style={{color: MainTheme.colorSenary}}>ล้าง</Text>
                </TouchableOpacity>

            </View> 
   
            <ProgressDialog
                visible={bluetooth.state === 'connecting'}
                message={bluetooth.state !== null ? bluetooth.state : ''}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={bluetooth.state === 'connect failed'}
                // onTouchOutside={() => setState(null)}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState(null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{bluetooth.state !== null ? bluetooth.state : ''}</Text>
                </View>
            </ConfirmDialog>

            {/* <Overlay 
                visible={
                    bluetooth.state === 'connecting'|| 
                    bluetooth.state === 'connect failed'
                }
                closeOnTouchOutside 
                animationType="zoomIn"
                containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}
                animationDuration={500}
                onClose={() => {
                    setState(null)
                }}>
                <Text>{bluetooth.state}</Text>
            </Overlay> */}
        </View>
    );
}

export default Form
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: MainTheme.colorSecondary
    },
    iconGroupContainer: {
        height: 60, 
        flexDirection: 'row', 
        padding: 5, 
        justifyContent: 'space-evenly', }
})

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})


