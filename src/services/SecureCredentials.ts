import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const REMEMBER_KEY = '@isRemember';
const USERNAME_KEY = '@savedUsername';
const KEYCHAIN_SERVICE = 'com.bplusvansales.credentials';

/**
 * isRemember flag — AsyncStorage
 */
export const getIsRemember = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(REMEMBER_KEY);
    return value === 'true';
  } catch {
    return false;
  }
};

export const setIsRemember = async (value: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(REMEMBER_KEY, value ? 'true' : 'false');
  } catch (e) {
    console.log('[SecureCredentials] setIsRemember error', e);
  }
};

export const getSavedUsername = async (): Promise<string> => {
  try {
    return (await AsyncStorage.getItem(USERNAME_KEY)) ?? '';
  } catch {
    return '';
  }
};

export const setSavedUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username ?? '');
  } catch (e) {
    console.log('[SecureCredentials] setSavedUsername error', e);
  }
};

/**
 * Username & Password — Keychain (encrypted)
 */
export const saveCredentials = async (
  username: string,
  password: string,
): Promise<boolean> => {
  try {
    await setSavedUsername(username);
    await Keychain.setGenericPassword(username, password, {
      service: KEYCHAIN_SERVICE,
    });
    return true;
  } catch (e) {
    console.log('[SecureCredentials] saveCredentials error', e);
    return false;
  }
};

export const getCredentials = async (): Promise<{
  username: string;
  password: string;
} | null> => {
  try {
    const savedUsername = await getSavedUsername();
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials) {
      return {
        username: savedUsername || credentials.username,
        password: credentials.password,
      };
    }
    return null;
  } catch (e) {
    console.log('[SecureCredentials] getCredentials error', e);
    return null;
  }
};

export const clearPassword = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  } catch (e) {
    console.log('[SecureCredentials] clearPassword error', e);
  }
};

export const clearCredentials = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    await AsyncStorage.removeItem(USERNAME_KEY);
  } catch (e) {
    console.log('[SecureCredentials] clearCredentials error', e);
  }
};

/**
 * Check if auto-login is possible:
 * isRemember=true + username not empty + password not empty
 */
export const canAutoLogin = async (): Promise<boolean> => {
  const isRemember = await getIsRemember();
  if (!isRemember) return false;

  const username = await getSavedUsername();
  const credentials = await getCredentials();
  if (!credentials || !username) return false;

  return !!credentials.password;
};
