import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { applyMiddleware, createStore } from 'redux'
import { thunk } from 'redux-thunk'

import AppNavigator from './src/AppNavigator'
import EventListenerHOC from './src/hoc/EventListenerHOC'
import { queryClient } from './src/queryClient'
import reducer from './src/reducer'

const MainApp = EventListenerHOC(AppNavigator)
const store = createStore(reducer, applyMiddleware(thunk))

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('App Error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>เกิดข้อผิดพลาด</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
})

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <MainApp />
      </ReduxProvider>
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
