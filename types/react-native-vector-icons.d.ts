declare module 'react-native-vector-icons/AntDesign' {
  import type AntDesignIcon from '@react-native-vector-icons/ant-design';

  const AntDesign: typeof AntDesignIcon;
  export default AntDesign;
}

declare module 'react-native-snackbar-component' {
  import type React from 'react';
  import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface SnackBarProps {
    accentColor?: string;
    messageColor?: string;
    backgroundColor?: string;
    distanceCallback?: ((distance: number) => void) | null;
    actionHandler?: (() => void) | null;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    visible?: boolean;
    actionText?: string;
    textMessage?: string | (() => React.ReactNode);
    position?: 'bottom' | 'top';
    autoHidingTime?: number;
    containerStyle?: StyleProp<ViewStyle>;
    messageStyle?: StyleProp<TextStyle>;
    actionStyle?: StyleProp<TextStyle>;
  }

  const SnackBar: React.ComponentType<SnackBarProps>;
  export default SnackBar;
}
