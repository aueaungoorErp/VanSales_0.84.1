import React from 'react'

import IPDFPreview from '../../../component/pdf/IPDFPreview'

const Index = (props) => {
    const { route } = props
    
    return (
        <IPDFPreview params={ route.params } />
    )
}

export default Index