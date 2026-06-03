import type React from 'react';
import type {
  GestureResponderEvent,
  StyleProp,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from 'react-native';

export interface ListItemIconConfig {
  name?: string;
  type?: string;
  size?: number;
  color?: string;
}

export interface ListItemProps extends Omit<TouchableOpacityProps, 'style'> {
  title?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  bottomDivider?: boolean;
  leftIcon?: ListItemIconConfig;
  hideChevron?: boolean;
  titleNumberOfLines?: number;
  children?: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | (() => void);
}

export interface ListItemContentProps extends ViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ListItemChevronProps extends TextProps {
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}

export interface IconProps {
  name?: string;
  type?: string;
  size?: number;
  color?: string;
  onPress?: ((event: GestureResponderEvent) => void) | (() => void);
  iconStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTitleStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  type?: 'outline' | string;
  large?: boolean;
}

export interface CheckBoxProps extends Omit<TouchableOpacityProps, 'style'> {
  title?: React.ReactNode;
  checked?: boolean;
  checkedColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ListItem: React.ComponentType<ListItemProps> & {
  Content: React.ComponentType<ListItemContentProps>;
  Chevron: React.ComponentType<ListItemChevronProps>;
};

export const Icon: React.ComponentType<IconProps>;
export const Button: React.ComponentType<ButtonProps>;
export const CheckBox: React.ComponentType<CheckBoxProps>;
export const ThemeProvider: React.ComponentType<{children?: React.ReactNode}>;
