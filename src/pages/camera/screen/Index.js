import React from 'react'
import ICamera from '../../../component/camera/ICamera'

import Navigator from '../../../services/Navigator'

const Index = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { takePicture, barcodeFinderVisible, onBarCodeRead } = routes[index].params || {}

    return (
        <ICamera
          reverseCamera={true}
          takePicture={takePicture}
          barcodeFinderVisible={barcodeFinderVisible}
          onBarCodeRead={onBarCodeRead}
        />
    )
}

export default Index