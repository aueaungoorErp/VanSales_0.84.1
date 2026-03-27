/**
 * ViewPropTypes + Text/Image/TextInput.propTypes polyfill for React Native 0.75+
 */
try {
  const PropTypes = require('prop-types');
  const RN = require('react-native');

  const stylePropType = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]);

  const viewPropTypes = {
    style: stylePropType,
    testID: PropTypes.string,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string,
    onLayout: PropTypes.func,
    pointerEvents: PropTypes.oneOf(['auto', 'box-none', 'box-only', 'none']),
    removeClippedSubviews: PropTypes.bool,
    collapsable: PropTypes.bool,
    needsOffscreenAlphaCompositing: PropTypes.bool,
  };

  const textPropTypes = { style: stylePropType };

  if (!RN.ViewPropTypes) {
    Object.defineProperty(RN, 'ViewPropTypes', {
      value: viewPropTypes,
      writable: true,
      configurable: true,
    });
  }

  [RN.Text, RN.Image, RN.TextInput].forEach((Comp) => {
    if (Comp && !Comp.propTypes) {
      try {
        Object.defineProperty(Comp, 'propTypes', {
          value: textPropTypes,
          writable: true,
          configurable: true,
        });
      } catch (e2) {
        Comp.propTypes = textPropTypes;
      }
    }
  });
} catch (e) {
  // ไม่บล็อก app
}
