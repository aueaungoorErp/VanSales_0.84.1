import { Component } from 'react';
import { BackHandler } from 'react-native';

/**
 * Simple BackHandler component that mirrors the react-navigation-backhandler API.
 * Calls `onBackPress` when the hardware back button is pressed.
 * Returns the result to control whether the default back behaviour is prevented.
 */
class AndroidBackHandler extends Component {
  _subscription = null;

  componentDidMount() {
    this._subscription = BackHandler.addEventListener('hardwareBackPress', this._handleBack);
  }

  componentWillUnmount() {
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  _handleBack = () => {
    if (this.props.onBackPress) {
      return this.props.onBackPress();
    }
    return false;
  };

  render() {
    return this.props.children || null;
  }
}

export { AndroidBackHandler };
export default AndroidBackHandler;
