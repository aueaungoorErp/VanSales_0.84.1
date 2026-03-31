import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import RNFS from 'react-native-fs'
import Pdf from 'react-native-pdf'
import RNPrint from 'react-native-print'
import AntDesign from 'react-native-vector-icons/AntDesign'

import Share from 'react-native-share'


class IPDFPreview extends React.Component {

    state = { selectedPrinter: null }

    printRemotePDF = () => async () => {
        console.log('printPDF ==>>', RNFS.DocumentDirectoryPath)
        console.log('printPDF ==>>', this.props.params.source)
        var path = this.props.params.source;
        await RNPrint.print({ filePath: path })
    }

    loadAndSharePDF = () => async () => {
        try {
            const source = this.props.params.source;
            // ดึงชื่อไฟล์จาก source เช่น bundle-assets://pdf/1.pdf -> 1.pdf
            const fileName = source.split('/').pop();
            // ใช้ path ใน assets เช่น pdf/1.pdf
            const assetPath = source.replace('bundle-assets://', '');

            // คัดลอกจาก bundle assets ไปยัง cache directory (ไม่ต้องขอ permission)
            const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
            await RNFS.copyFileAssets(assetPath, cachePath);

            // แชร์ไฟล์ PDF
            await Share.open({
                title: fileName,
                url: `file://${cachePath}`,
                type: 'application/pdf',
                showAppsToView: true,
            });
        } catch (error) {
            if (error && error.message !== 'User did not share') {
                console.log('Share error:', error);
            }
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Pdf
                    source={{ uri: this.props.params.source }}
                    onLoadComplete={(numberOfPages, filePath) => {}}
                    onPageChanged={(page, numberOfPages) => {}}
                    onError={(error) => {
                        console.log(error)
                    }}
                    style={styles.pdf}
                    scale={2.5}
                />

                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.shareButton} onPress={this.loadAndSharePDF()} activeOpacity={0.7}>
                        <AntDesign name="sharealt" size={20} color="#fff" />
                        <Text style={styles.shareText} allowFontScaling={false}>แชร์ไฟล์</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E4E8',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#47BA8F',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    shareText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})

export default IPDFPreview