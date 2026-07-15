import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const BUNDLE_ASSETS_PREFIX = 'bundle-assets://';

export const getBundledPdfFileName = source => {
  if (!source || !source.startsWith(BUNDLE_ASSETS_PREFIX)) {
    return null;
  }
  return source.split('/').pop();
};

export const getBundledPdfAssetPath = source => {
  if (!source || !source.startsWith(BUNDLE_ASSETS_PREFIX)) {
    return null;
  }
  return source.replace(BUNDLE_ASSETS_PREFIX, '');
};

export const resolveBundledPdfUri = async source => {
  if (!source) {
    throw new Error('ไม่พบไฟล์ PDF ที่ต้องการเปิด');
  }

  if (!source.startsWith(BUNDLE_ASSETS_PREFIX)) {
    return source;
  }

  const fileName = getBundledPdfFileName(source);
  const assetPath = getBundledPdfAssetPath(source);

  if (Platform.OS === 'android') {
    return source;
  }

  const candidatePaths = [
    `${RNFS.MainBundlePath}/${assetPath}`,
    `${RNFS.MainBundlePath}/pdf/${fileName}`,
    `${RNFS.MainBundlePath}/${fileName}`,
  ];

  for (const bundlePath of candidatePaths) {
    if (await RNFS.exists(bundlePath)) {
      return `file://${bundlePath}`;
    }
  }

  throw new Error(`ไม่พบไฟล์ PDF ใน iOS bundle: ${fileName}`);
};

export const copyBundledPdfToCache = async source => {
  const fileName = getBundledPdfFileName(source);
  if (!fileName) {
    throw new Error('ไม่พบไฟล์ PDF ที่ต้องการแชร์');
  }

  const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
  const cacheExists = await RNFS.exists(cachePath);
  if (cacheExists) {
    return { fileName, filePath: cachePath };
  }

  if (Platform.OS === 'android') {
    const assetPath = getBundledPdfAssetPath(source);
    await RNFS.copyFileAssets(assetPath, cachePath);
    return { fileName, filePath: cachePath };
  }

  const resolvedUri = await resolveBundledPdfUri(source);
  const bundlePath = resolvedUri.replace(/^file:\/\//, '');
  await RNFS.copyFile(bundlePath, cachePath);

  return { fileName, filePath: cachePath };
};
