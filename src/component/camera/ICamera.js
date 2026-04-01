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

const sanitizeRawScanValue = value => {
	if (value === null || value === undefined) {
		return null;
	}

	const text = String(value).replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
	return text || null;
};

const collectStringValues = (input, bucket, depth = 0) => {
	if (depth > 5 || input === null || input === undefined) {
		return;
	}

	if (typeof input === 'string' || typeof input === 'number') {
		const sanitized = sanitizeRawScanValue(input);
		if (sanitized && !bucket.includes(sanitized)) {
			bucket.push(sanitized);
		}
		return;
	}

	if (Array.isArray(input)) {
		input.forEach(item => collectStringValues(item, bucket, depth + 1));
		return;
	}

	if (typeof input === 'object') {
		Object.values(input).forEach(value => collectStringValues(value, bucket, depth + 1));
	}
};

const getQrPayloadScore = value => {
	const normalized = sanitizeRawScanValue(value);
	if (!normalized || normalized === '0') {
		return -1;
	}

	if (normalized.startsWith('000201')) {
		return 1000 + normalized.length;
	}

	if (normalized.includes('000201')) {
		return 950 + normalized.length;
	}

	if (normalized.includes('5303764') && normalized.includes('5802TH')) {
		return 900 + normalized.length;
	}

	if (normalized.length >= 20) {
		return 500 + normalized.length;
	}

	return normalized.length;
};

const getCodeTypePriority = codeType => {
	const normalizedType = String(codeType || '').toLowerCase();

	if (normalizedType.includes('qr')) {
		return 3;
	}

	if (normalizedType.includes('ean') || normalizedType.includes('upc')) {
		return 2;
	}

	if (normalizedType.includes('code')) {
		return 1;
	}

	return 0;
};

const getRawScanPayload = code => {
	const candidates = [];

	[
		code?.value,
		code?.displayValue,
		code?.content?.data,
		code?.rawValue,
		code,
	].forEach(value => collectStringValues(value, candidates));

	const uniqueCandidates = candidates.filter(
		(candidate, index, self) => self.indexOf(candidate) === index,
	);

	const sortedCandidates = uniqueCandidates.sort((left, right) => {
		return getQrPayloadScore(right) - getQrPayloadScore(left);
	});

	return {
		data: sortedCandidates[0] || null,
		alternates: sortedCandidates.slice(1),
		originalData: sortedCandidates[0] || null,
	};
};

const pickBestScannedCode = codes => {
	if (!Array.isArray(codes) || codes.length === 0) {
		return null;
	}

	let bestCode = null;
	let bestPayload = null;

	codes.forEach(code => {
		const payload = getRawScanPayload(code);
		if (!payload.data) {
			return;
		}

		if (!bestCode) {
			bestCode = code;
			bestPayload = payload;
			return;
		}

		const currentPriority = getCodeTypePriority(code?.type);
		const bestPriority = getCodeTypePriority(bestCode?.type);
		const currentLength = String(payload.data || '').length;
		const bestLength = String(bestPayload?.data || '').length;

		if (
			currentPriority > bestPriority ||
			(currentPriority === bestPriority && currentLength > bestLength)
		) {
			bestCode = code;
			bestPayload = payload;
		}
	});

	if (!bestCode || !bestPayload) {
		return null;
	}

	return {
		code: bestCode,
		payload: bestPayload,
	};
};

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

			const bestScan = pickBestScannedCode(codes);
			if (!bestScan?.payload?.data) {
				return;
			}

			console.log('VisionCamera bestScan', JSON.stringify({
				type: bestScan.code?.type,
				data: bestScan.payload.data,
				alternates: bestScan.payload.alternates,
			}));

			scannedRef.current = true;
			if (onBarCodeRead) {
				onBarCodeRead({
					data: bestScan.payload.data,
					alternates: bestScan.payload.alternates,
					originalData: bestScan.payload.originalData,
					type: bestScan.code?.type || 'barcode',
					rawValue: bestScan.code,
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
