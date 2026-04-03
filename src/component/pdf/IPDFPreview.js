import React from 'react'
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import RNFS from 'react-native-fs'
import Pdf from 'react-native-pdf'
import RNPrint from 'react-native-print'
import AntDesign from 'react-native-vector-icons/AntDesign'

import Share from 'react-native-share'


class IPDFPreview extends React.Component {

    state = { selectedPrinter: null, isSharing: false }

    printRemotePDF = () => async () => {
        console.log('printPDF ==>>', RNFS.DocumentDirectoryPath)
        console.log('printPDF ==>>', this.props.params.source)
        var path = this.props.params.source;
        await RNPrint.print({ filePath: path })
    }

    _resolveShareFile = async () => {
        const source = this.props.params.source;

        if (!source) {
            throw new Error('ไม่พบไฟล์ PDF ที่ต้องการแชร์');
        }

        if (source.startsWith('bundle-assets://')) {
            const fileName = source.split('/').pop();
            const assetPath = source.replace('bundle-assets://', '');
            const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            const exists = await RNFS.exists(cachePath);
            if (!exists) {
                await RNFS.copyFileAssets(assetPath, cachePath);
            }

            return {
                fileName,
                filePath: cachePath,
            };
        }

        const normalizedPath = source.startsWith('file://')
            ? source.replace('file://', '')
            : source;

        const exists = await RNFS.exists(normalizedPath);
        if (!exists) {
            throw new Error('ไม่พบไฟล์ PDF ที่ต้องการแชร์');
        }

        return {
            fileName: normalizedPath.split('/').pop(),
            filePath: normalizedPath,
        };
    }

    loadAndSharePDF = async () => {
        try {
            this.setState({ isSharing: true });

            const { fileName, filePath } = await this._resolveShareFile();
            const fileBase64 = await RNFS.readFile(filePath, 'base64');

            if (!fileBase64) {
                throw new Error('ไม่สามารถอ่านไฟล์ PDF เพื่อแชร์ได้');
            }

            const shareUrl = `data:application/pdf;base64,${fileBase64}`;

            await Share.open({
                title: fileName,
                urls: [shareUrl],
                filenames: [fileName],
                failOnCancel: false,
                useInternalStorage: true,
                type: 'application/pdf',
            });
        } catch (error) {
            if (error && error.message !== 'User did not share' && error.message !== 'User did not share data') {
                console.log('Share error:', error);
                Alert.alert('ประกาศ', error.message || 'ไม่สามารถแชร์ไฟล์ PDF ได้');
            }
        } finally {
            this.setState({ isSharing: false });
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
                    <TouchableOpacity style={[styles.shareButton, this.state.isSharing && styles.shareButtonDisabled]} onPress={this.loadAndSharePDF} activeOpacity={0.7} disabled={this.state.isSharing}>
                        <AntDesign name="sharealt" size={20} color="#fff" />
                        <Text style={styles.shareText} allowFontScaling={false}>{this.state.isSharing ? 'กำลังเตรียมไฟล์...' : 'แชร์ไฟล์'}</Text>
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
    shareButtonDisabled: {
        opacity: 0.7,
    },
    shareText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})

export default IPDFPreview