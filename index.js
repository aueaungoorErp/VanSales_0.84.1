/**
 * @format
 */

import './polyfill';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(false);
LogBox.ignoreLogs(['Debugger and device times']);
LogBox.ignoreLogs(['Remote debugger is in']);
LogBox.ignoreLogs(['Deprecation warning: years']);

if (__DEV__) {
  try {
    require('./ReactotronConfig');
  } catch (e) {}
}

try {
  AppRegistry.registerComponent(appName || 'bplusvansales', () => App);
} catch (e) {
  const fallbackName = 'bplusvansales';
  AppRegistry.registerComponent(fallbackName, () => App);
}
