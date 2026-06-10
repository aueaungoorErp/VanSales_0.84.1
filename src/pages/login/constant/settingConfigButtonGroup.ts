import { strings } from '../../../locales/i18n';

export type SettingConfigButtonItem = {
  title: string;
  methodName: 'confirm' | 'clear' | 'back';
  variant: 'primary' | 'secondary';
};

export const settingConfigButtonGroup: SettingConfigButtonItem[] = [
  {
    title: strings('login_setting.connect'),
    methodName: 'confirm',
    variant: 'primary',
  },
  {
    title: strings('login_setting.clear'),
    methodName: 'clear',
    variant: 'secondary',
  },
  {
    title: strings('login_setting.saveandback'),
    methodName: 'back',
    variant: 'secondary',
  },
];
