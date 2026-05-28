import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';

export const settingConfigButtonGroup = [
  {
    title: strings('login_setting.connect'),
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      width: 100,
      elevation: 0,
      borderColor: MainTheme.colorPrimary,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: strings('login_setting.clear'),
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      width: 100,
      elevation: 0,
      borderWidth: 0.5,
      borderColor: MainTheme.colorButtonBorder,
    },
    titleStyle: { color: MainTheme.colorPrimary },
    size: 50,
    methodType: 'function',
    methodName: 'clear',
  },
  {
    title: strings('login_setting.saveandback'),
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      width: 100,
      elevation: 0,
      borderWidth: 0.5,
      borderColor: MainTheme.colorButtonBorder,
    },
    titleStyle: { color: MainTheme.colorPrimary },
    size: 50,
    methodType: 'function',
    methodName: 'back',
  },
];
