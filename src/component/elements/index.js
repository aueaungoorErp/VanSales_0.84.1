/**
 * Local replacement for react-native-elements.
 * Uses only React Native built-in components.
 */
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { resolveVectorIconComponent } from '../../utils/iconFactory';

/**
 * ListItem - replaces react-native-elements ListItem
 */
export const ListItem = ({
  title,
  containerStyle,
  style,
  bottomDivider,
  leftIcon,
  hideChevron,
  titleNumberOfLines,
  children,
  onPress,
  ...rest
}) => {
  const LeftIconComponent = resolveVectorIconComponent(leftIcon?.type, AntDesign);

  const content = (
    <>
      {leftIcon && leftIcon.name ? (
        <LeftIconComponent
          name={leftIcon.name === 'bluetooth' ? 'scan1' : leftIcon.name}
          size={leftIcon.size || 20}
          color={leftIcon.color || '#333'}
          style={{marginRight: 10}}
        />
      ) : null}
      {children ? (
        children
      ) : (
        <View style={{flex: 1}}>
          {typeof title === 'string' || typeof title === 'number' ? (
            <Text numberOfLines={titleNumberOfLines}>{title}</Text>
          ) : (
            title
          )}
        </View>
      )}
      {!children && !hideChevron ? <AntDesign name="right" size={14} color="#ccc" /> : null}
    </>
  );

  const containerStyles = [
    {paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center'},
    style,
    containerStyle,
    bottomDivider && {borderBottomWidth: 1, borderBottomColor: '#e1e8ee'},
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyles} onPress={onPress} activeOpacity={0.7} {...rest}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyles} {...rest}>
      {content}
    </View>
  );
};

ListItem.Content = ({children, style, ...rest}) => (
  <View style={[{flex: 1}, style]} {...rest}>
    {children}
  </View>
);

ListItem.Chevron = ({color, size, style, ...rest}) => (
  <AntDesign name="right" size={size || 14} color={color || '#ccc'} style={style} {...rest} />
);

/**
 * Icon - replaces react-native-elements Icon
 */
export const Icon = ({name, type, size, color, onPress, iconStyle, containerStyle, ...rest}) => {
  const IconComponent = resolveVectorIconComponent(type, AntDesign);
  const iconComponent = (
    <IconComponent
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
