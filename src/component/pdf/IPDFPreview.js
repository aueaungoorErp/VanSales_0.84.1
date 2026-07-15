import React from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import RNPrint from 'react-native-print';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';
import { copyBundledPdfToCache, resolveBundledPdfUri } from '../../utils/bundledPdf';

class IPDFPreview extends React.Component {
  state = {
    selectedPrinter: null,
    isSharing: false,
    pdfUri: null,
    isLoading: true,
    loadError: null,
  };

  componentDidMount() {
    this._resolvePdfSource();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params?.source !== this.props.params?.source) {
      this._resolvePdfSource();
    }
  }

  _resolvePdfSource = async () => {
    const source = this.props.params?.source;
    this.setState({ isLoading: true, loadError: null, pdfUri: null });

    try {
      const pdfUri = await resolveBundledPdfUri(source);
      this.setState({ pdfUri, isLoading: false, loadError: null });
    } catch (error) {
      const message = error?.message || 'ไม่สามารถโหลดไฟล์ PDF ได้';
      this.setState({ isLoading: false, loadError: message });
    }
  };

  printRemotePDF = () => async () => {
    const path = this.state.pdfUri || this.props.params.source;
    await RNPrint.print({
      filePath: path,
    });
  };

  _resolveShareFile = async () => {
    const source = this.props.params?.source;
    if (!source) {
      throw new Error('ไม่พบไฟล์ PDF ที่ต้องการแชร์');
    }

    if (source.startsWith('bundle-assets://')) {
      return copyBundledPdfToCache(source);
    }

    const normalizedPath = source.startsWith('file://') ? source.replace('file://', '') : source;
    const exists = await RNFS.exists(normalizedPath);
    if (!exists) {
      throw new Error('ไม่พบไฟล์ PDF ที่ต้องการแชร์');
    }

    return {
      fileName: normalizedPath.split('/').pop(),
      filePath: normalizedPath,
    };
  };

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
  };

  _handlePdfError = error => {
    const message = error?.message || 'ไม่สามารถแสดงไฟล์ PDF ได้';
    this.setState({ loadError: message, isLoading: false });
  };

  render() {
    const { pdfUri, isLoading, loadError } = this.state;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#47BA8F" />
            <Text style={styles.statusText} allowFontScaling={false}>กำลังโหลดไฟล์ PDF...</Text>
          </View>
        ) : null}

        {!isLoading && loadError ? (
          <View style={styles.centerContent}>
            <AntDesign name="exclamationcircleo" size={36} color="#E74C3C" />
            <Text style={styles.errorText} allowFontScaling={false}>{loadError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={this._resolvePdfSource} activeOpacity={0.7}>
              <Text style={styles.retryText} allowFontScaling={false}>ลองอีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoading && !loadError && pdfUri ? (
          <Pdf
            source={{ uri: pdfUri }}
            onLoadComplete={() => {}}
            onPageChanged={() => {}}
            onError={this._handlePdfError}
            style={styles.pdf}
            scale={3.2}
            initialOffsetX={1200}
          />
        ) : null}

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.shareButton, (this.state.isSharing || isLoading || !!loadError) && styles.shareButtonDisabled]}
            onPress={this.loadAndSharePDF}
            activeOpacity={0.7}
            disabled={this.state.isSharing || isLoading || !!loadError}>
            <AntDesign name="sharealt" size={20} color="#fff" />
            <Text style={styles.shareText} allowFontScaling={false}>
              {this.state.isSharing ? 'กำลังเตรียมไฟล์...' : 'แชร์ไฟล์'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#47BA8F',
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
});

export default IPDFPreview;
