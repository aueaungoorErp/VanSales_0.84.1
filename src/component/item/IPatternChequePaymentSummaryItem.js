import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { toBuddhistYear } from '../../utils/Date'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const Input = React.forwardRef(({ value, style, ...props }, ref) => (
    <TextInput
        ref={ref}
        value={value === null || value === undefined ? '' : String(value)}
        style={style}
        underlineColorAndroid="transparent"
        {...props}
    />
))

class IPatternChequePaymentSummaryItem extends React.Component {
    
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (!_.isEqual(nextProps.item, this.props.item)) {
            return true
        }   
        
        return false
    }

    render() {
        const { title, VPH_CHEQUE_BANK, VPH_CHEQUE_DATE, VPH_CHEQUE_NO, VPH_CHEQUE_AMT } = this.props
        const { bankFileListItems } = this.props.masterData
        const bankFileItem = bankFileListItems[bankFileListItems.findIndex(item => item.BANK_KEY === VPH_CHEQUE_BANK)]
        
        return (
            <View>
                <Item style={styles.rowSection}>
                    <Text style={{ flex: 0.2 }}>{ title }</Text>
                    <Item style={styles.inputSection}>
                        <Input editable={false} value={bankFileItem.BANK_T_NAME} />
                    </Item>
                </Item>
                <Item style={styles.rowSection}>
                    <Text style={{ flex: 0.2 }}></Text>
                    <Item style={styles.inputSection}>
                        <Input editable={false} value={toBuddhistYear(VPH_CHEQUE_DATE)} />
                    </Item>
                </Item>
                <Item style={styles.rowSection}>
                    <Text style={{ flex: 0.2 }}></Text>
                    <Item style={styles.inputSection}>
                        <Input editable={false} value={VPH_CHEQUE_NO} />
                    </Item>
                </Item>
                <Item style={styles.rowSection}>
                    <Text style={{ flex: 0.2 }}></Text>
                    <Item style={styles.inputSection}>
                        <Input editable={false} style={{ textAlign: 'right' }} value={VPH_CHEQUE_AMT.toFixed(2)} />
                    </Item>
                </Item>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    masterData: state.masterData
})

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IPatternChequePaymentSummaryItem)

const styles = StyleSheet.create({
    container: {

    },
    rowSection: {
        borderBottomWidth: 0,
        borderColor: '#d6d7da',
        flexDirection: 'row',
        marginRight: 10
    },
    inputSection: {
        flex: 0.8
    }
})