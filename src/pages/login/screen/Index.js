import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CTForm from '../container/CTForm';
import {MainTheme} from '../../../constant/lov';

class Index extends Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <CTForm navigation={this.props.navigation} />
      </View>
    );
  }
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
  },
});
