import React from 'react'

import Navigator from '../../../services/Navigator'
import IPDFPreview from '../../../component/pdf/IPDFPreview'

const Index = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { params } = routes[index]
    
    return (
        <IPDFPreview params={ params } />
    )
}

export default Index