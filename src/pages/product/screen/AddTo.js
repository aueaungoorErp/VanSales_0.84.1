import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import BackHandlerHOC from '../../../hoc/BackHandlerHOC'
import { mainContainer } from '../../../constant/lov'
import CTButtonGroupSCR from '../container/CTButtonGroupSCR'
import CTSearchForm from '../container/CTSearchForm'
import CTDetailForm from '../container/CTDetailForm'
import CTDetailFormSCR from '../container/CTDetailFormSCR'
import CTListItems from '../container/CTListItems'
import CTSearchSection from '../container/CTSearchSection'
import Navigator from '../../../services/Navigator'

class AddTo extends Component {

    constructor(props) {
        super(props)

        this.state = {
            inputQtyRef: null
        }
    }

    _getInputQtyRef = (ref) => {
        this.setState(oldState => {
            return {
                inputQtyRef: ref
            }
        })
    }

    render() {
        const { routes, index } = Navigator.getCurrentRoute()
        const { actionType } = routes[index].params

        return (
            <View style={styles.container}>
                <View>
                    <CTSearchSection>
                        <View style={{width: '100%', height: '100%', paddingBottom: 0}}>
                            <CTSearchForm screen={'ProductAddTo'} actionType={actionType} />
                            <CTListItems screen={'ProductAddTo'} actionType={actionType} inputQtyRef={this.state.inputQtyRef}/>
                        </View>
                    </CTSearchSection>
                </View>
                {
                    actionType === 'add' || actionType === 'add_stock_balance' ?
                        <CTDetailForm goodsCodeEditable={true} getInputQtyRef={this._getInputQtyRef} />
                        : 
                        <View style={{ flex: 1}}>
                            <CTDetailFormSCR actionType={actionType} />
                            <CTButtonGroupSCR />
                        </View>
                }
                
            </View>
        )
    }
}

export default BackHandlerHOC(AddTo)

const styles = StyleSheet.create({
    container: mainContainer
})