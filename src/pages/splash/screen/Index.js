import React from 'react'
import CTForm from '../container/CTForm'

class Index extends React.Component {
  static navigationOptions = { header: null }
  
  constructor() {
		super()
	}
  
  render() {
    return (
      <CTForm navigation={this.props.navigation} />
    )
  }
}

export default Index

