import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';
import { MainTheme } from '../../constant/lov';
import Navigator from '../../services/Navigator';
import BarcodeFinder from './IBarcodeFinder';

const ICamera = ({
	takePicture,
	barcodeFinderVisible,
	onBarCodeRead,
	reverseCamera = true,
}) => {
	const camera = useRef(null);
	const isFocused = useIsFocused();
	const [cameraPosition, setCameraPosition] = useState('back');
	const [permissionState, setPermissionState] = useState('not-determined');
	const [working, setWorking] = useState(false);
	const scannedRef = useRef(false);

	const device = useCameraDevice(cameraPosition);

	useEffect(() => {
		let mounted = true;

		const requestPermission = async () => {
			const currentStatus = await Camera.getCameraPermissionStatus();

			if (currentStatus === 'granted') {
				if (mounted) {
					setPermissionState('granted');
				}
				return;
			}

			const nextStatus = await Camera.requestCameraPermission();
			if (mounted) {
				setPermissionState(nextStatus);
			}
		};

		requestPermission();

		return () => {
			mounted = false;
		};
	}, []);

	const codeScanner = useCodeScanner({
		codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'upc-a', 'upc-e'],
		onCodeScanned: codes => {
			if (!barcodeFinderVisible || scannedRef.current || !codes?.length) {
				return;
			}

			const code = codes[0];
			const value = code?.value ? String(code.value).replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : null;
			if (!value) {
				return;
			}

			console.log('VisionCamera scanned', JSON.stringify({
				type: code?.type,
				data: value,
			}));

			scannedRef.current = true;
			if (onBarCodeRead) {
				onBarCodeRead({
					data: value,
					type: code?.type || 'barcode',
				});
			}

			setTimeout(() => {
				scannedRef.current = false;
			}, 1200);
		},
	});

	const handleTakePicture = async () => {
		if (!takePicture || !camera.current || working) {
			return;
		}

		try {
			setWorking(true);
			const photo = await camera.current.takePhoto({
				qualityPrioritization: 'balanced',
				enableAutoRedEyeReduction: false,
			});

			const photoData = {
				...photo,
				uri: photo?.path ? `file://${photo.path}` : undefined,
			};
			await takePicture(photoData);
		} finally {
			setWorking(false);
		}
	};

	if (permissionState !== 'granted') {
		return (
			<View style={styles.centerState}>
				<Text style={styles.stateTitle}>ไม่สามารถเปิดกล้องได้</Text>
				<Text style={styles.stateText}>กรุณาอนุญาตการใช้งานกล้องก่อน</Text>
			</View>
		);
	}

	if (!device) {
		return (
			<View style={styles.centerState}>
				<ActivityIndicator size="large" color={MainTheme.colorPrimary} />
				<Text style={styles.stateText}>กำลังเปิดกล้อง...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Camera
				ref={camera}
				style={StyleSheet.absoluteFill}
				device={device}
				isActive={isFocused}
				photo={Boolean(takePicture)}
				codeScanner={onBarCodeRead ? codeScanner : undefined}
			/>

			{barcodeFinderVisible ? (
				<BarcodeFinder width={280} height={220} borderColor="#FF4D4F" borderWidth={2} />
			) : null}

			<View style={styles.topBar}>
				<TouchableOpacity style={styles.topButton} onPress={() => Navigator.back()}>
					<Text style={styles.topButtonText}>ปิด</Text>
				</TouchableOpacity>
			</View>

			{!barcodeFinderVisible ? (
				<View style={styles.footer}>
					<View style={styles.sideControl} />
					<TouchableOpacity
						onPress={handleTakePicture}
						disabled={working}
						style={[styles.captureButton, working ? styles.captureButtonDisabled : null]}>
						<Text style={styles.captureButtonText}>{working ? 'กำลังถ่าย...' : 'ถ่าย'}</Text>
					</TouchableOpacity>
					{reverseCamera ? (
						<TouchableOpacity
							style={styles.sideControl}
							onPress={() =>
								setCameraPosition(current => (current === 'back' ? 'front' : 'back'))
							}>
							<Text style={styles.switchText}>สลับ</Text>
						</TouchableOpacity>
					) : (
						<View style={styles.sideControl} />
					)}
				</View>
			) : (
				<View style={styles.scanHintWrap}>
					<Text style={styles.scanHintText}>นำบาร์โค้ดหรือ QR Code ให้อยู่ในกรอบ</Text>
				</View>
			)}
		</View>
	);
};

export default ICamera;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
	},
	centerState: {
		flex: 1,
		backgroundColor: '#000000',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	stateTitle: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 8,
	},
	stateText: {
		color: '#D1D5DB',
		fontSize: 14,
		textAlign: 'center',
		marginTop: 12,
	},
	topBar: {
		position: 'absolute',
		top: 18,
		left: 16,
		right: 16,
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	topButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.55)',
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 999,
	},
	topButtonText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
	},
	footer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 24,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
	},
	sideControl: {
		width: 74,
		alignItems: 'center',
		justifyContent: 'center',
	},
	switchText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '600',
	},
	captureButton: {
		minWidth: 92,
		backgroundColor: '#FFFFFF',
		borderRadius: 999,
		paddingHorizontal: 24,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	captureButtonDisabled: {
		backgroundColor: '#D1D5DB',
	},
	captureButtonText: {
		color: '#111827',
		fontSize: 15,
		fontWeight: '700',
	},
	scanHintWrap: {
		position: 'absolute',
		left: 24,
		right: 24,
		bottom: 42,
		alignItems: 'center',
	},
	scanHintText: {
		color: '#FFFFFF',
		fontSize: 14,
		textAlign: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.55)',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 999,
		overflow: 'hidden',
	},
});
