import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainTheme } from '../../constant/lov';

type IActionButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const IActionButton: React.FC<IActionButtonProps> = ({
  title,
  onPress,
  variant = 'secondary',
  disabled = false,
  style,
  titleStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled ? styles.disabledButton : null,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text
        style={[
          styles.title,
          variant === 'primary' ? styles.primaryTitle : styles.secondaryTitle,
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default IActionButton;

const styles = StyleSheet.create({
  button: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
  primaryButton: {
    backgroundColor: MainTheme.colorPrimary,
    borderColor: MainTheme.colorPrimary,
  },
  secondaryButton: {
    backgroundColor: MainTheme.colorSecondary,
    borderWidth: 0.5,
    borderColor: MainTheme.colorButtonBorder,
  },
  disabledButton: {
    opacity: 0.6,
  },
  title: {
    fontSize: hp('1.7%'),
  },
  primaryTitle: {
    color: MainTheme.colorSecondary,
  },
  secondaryTitle: {
    color: MainTheme.colorPrimary,
  },
});