/**
 * Local replacement for react-native-elements.
 * Uses only React Native built-in components.
 */
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**
 * ListItem - replaces react-native-elements ListItem
 */
export const ListItem = ({
  title,
  containerStyle,
  bottomDivider,
  leftIcon,
  hideChevron,
  titleNumberOfLines,
  ...rest
}) => (
  <View
    style={[
      {paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center'},
      containerStyle,
      bottomDivider && {borderBottomWidth: 1, borderBottomColor: '#e1e8ee'},
    ]}>
    {leftIcon && leftIcon.name ? (
      <AntDesign
        name={leftIcon.name === 'bluetooth' ? 'scan1' : leftIcon.name}
        size={leftIcon.size || 20}
        color={leftIcon.color || '#333'}
        style={{marginRight: 10}}
      />
    ) : null}
    <View style={{flex: 1}}>{title}</View>
    {!hideChevron ? <AntDesign name="right" size={14} color="#ccc" /> : null}
  </View>
);

/**
 * Icon - replaces react-native-elements Icon
 */
export const Icon = ({name, type, size, color, onPress, iconStyle, containerStyle, ...rest}) => {
  const iconComponent = (
    <AntDesign
      name={name || 'questioncircleo'}
      size={size || 24}
      color={color || '#333'}
      style={iconStyle}
    />
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle} activeOpacity={0.7}>
        {iconComponent}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{iconComponent}</View>;
};

/**
 * Button - replaces react-native-elements Button
 */
export const Button = ({
  title,
  titleStyle,
  buttonStyle,
  containerStyle,
  onPress,
  disabled,
  disabledStyle,
  disabledTitleStyle,
  icon,
  type,
  large,
  ...rest
}) => (
  <View style={containerStyle}>
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        buttonStyle,
        type === 'outline' && {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#47BA8F'},
        disabled && [{backgroundColor: '#ccc'}, disabledStyle],
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      {icon || null}
      <Text
        style={[
          {color: '#fff', fontSize: 14, fontWeight: '600'},
          titleStyle,
          disabled && [{color: '#999'}, disabledTitleStyle],
        ]}
        allowFontScaling={false}>
        {title}
      </Text>
    </TouchableOpacity>
  </View>
);

/**
 * CheckBox - replaces react-native-elements CheckBox
 */
export const CheckBox = ({
  title,
  checked,
  onPress,
  checkedColor,
  containerStyle,
  textStyle,
  ...rest
}) => (
  <TouchableOpacity
    style={[{flexDirection: 'row', alignItems: 'center', paddingVertical: 4}, containerStyle]}
    onPress={onPress}
    activeOpacity={0.7}>
    <AntDesign
      name={checked ? 'checksquare' : 'checksquareo'}
      size={20}
      color={checked ? (checkedColor || '#47BA8F') : '#ccc'}
      style={{marginRight: 8}}
    />
    {title ? <Text style={[{fontSize: 14}, textStyle]}>{title}</Text> : null}
  </TouchableOpacity>
);

/**
 * ThemeProvider - replaces react-native-elements ThemeProvider (no-op)
 */
export const ThemeProvider = ({children}) => <>{children}</>;
