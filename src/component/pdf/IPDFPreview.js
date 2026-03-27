import React from 'react'
import { StyleSheet, Dimensions, View, Button, Text, Image, TouchableHighlight, ImageBackground } from 'react-native'

import Pdf from 'react-native-pdf'
import RNPrint from 'react-native-print'
import RNFS from 'react-native-fs'

import { Icon } from 'react-native-elements'
import Share from 'react-native-share';


class IPDFPreview extends React.Component {

    state = { selectedPrinter: null }

    printRemotePDF = () => async () => {
        console.log('printPDF ==>>', RNFS.DocumentDirectoryPath)
        console.log('printPDF ==>>', this.props.params.source)
        var path = this.props.params.source;
        await RNPrint.print({ filePath: path })
    }

    loadAndSharePDF = () => async () => {
        const filePath = this.props.params.source;
        // const url ="https://www.soc.go.th/wp-content/uploads/2019/03/Test-pdf-1.pdf"
        //const url =  this.props.params.source;

        // กำหนดตำแหน่งไดเรกทอรีใหม่
        const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/Documents/bplus_vansales/`;

        //await Share.share({ url });

        // ตรวจสอบและสร้างไดเรกทอรีใหม่
        const directoryExists = await RNFS.exists(directoryPath);
        if (!directoryExists) {
            await RNFS.mkdir(directoryPath);
        }

        // กำหนดตำแหน่งของไฟล์ PDF
        const oldFilePath = this.props.params.source;
        const fileName = oldFilePath.split('/').pop();
        const newFilePath = `${directoryPath}${fileName}`;

        // คัดลอกไฟล์ PDF ไปยังไดเรกทอรีใหม่
        await RNFS.copyFile(oldFilePath, newFilePath);

        // แชร์ไฟล์ PDF
        const url = `file://${newFilePath}`;

        Share.open({
            message: fileName,
            url: url,
            showAppsToView: true
        })

        // await Share.share({
        //     title: 'Some Title',
        //     // Android
        //     message: url,
        //     //ios
        //     url: url,
        //     type: 'application/pdf',
        //     failOnCancel: true,
        // }, { dialogTitle: "Android Title" })
        //     .then(({ action, activityType }) => {
        //         if (action === Share.sharedAction)
        //             console.log('Share was successful');
        //         else
        //             console.log('Share was dismissed');
        //     })
        //     .catch(err => console.log(err))

        //         ตอนนี้ไฟล์ pdf บันทึกไปที่ path  file:///storage/emulated/0/Android/data/com.bplusvansales/files/Documents/

        // ฉันต้องการเปลี่ยนตำแหน่งไปบันทึกที่ file:///storage/emulated/0/Documents/bplus_vansales/ แทน 


        //  await Share.share({
        //                 //title: "This is my report ",
        //                 //message: "Message:",
        //                 url: url,
        //                 //subject: "Report",
        //                  mimeType: 'application/pdf',
        //     title: 'Pdf'
        //             })
    }


    render() {
        // const source = { uri: 'bundle-assets://pdf/thereactnativebook-sample.pdf', cache: this.props.params.cache }
        // console.log('this.props.params.source', this.props.params.source)
        return (
            <View style={styles.container} >

                <Text> {"\n"} </Text>


                <Pdf
                    source={{ uri: this.props.params.source }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        // console.log(`number of pages: ${numberOfPages}`)
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        // console.log(`current page: ${page}`)
                    }}
                    onError={(error) => {
                        console.log(error)
                    }}
                    style={styles.pdf}
                    scale={2.5}
                />

                <TouchableHighlight onPress={this.loadAndSharePDF()}  >
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Text style={{ fontSize: 18 }}> {"Share File"} </Text>
                        <Image source={require('../../../src/images/share.png')}
                            style={
                                {
                                    width: 22,
                                    height: 22,
                                    alignSelf: 'center',
                                    marginHorizontal: 5,
                                }
                            }
                        />


                    </View>
                </TouchableHighlight>
                <Text> {"\n"} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width * 200,
        height: Dimensions.get('window').height * 200,
        marginTop: -30,
    },
    button: {
        marginLeft: 30,
    }
})

export default IPDFPreview