import React from 'react'
import { FlatList, RefreshControl } from 'react-native'

const IList = (props) => {

    const keyExtractor = (item, index) => index.toString()
    const { 
        horizontal, 
        header, 
        footer, 
        data, 
        renderItem, 
        stickyHeaderIndices, 
        numColumns, 
        style, 
        onTouchStart, 
        onTouchEnd, 
        onTouchCancel, 
        refreshing, 
        onRefresh,
        onScroll,
        scrollEnabled
     } = props 

    const renderDom = (
        <FlatList
            horizontal={horizontal}
            keyExtractor={keyExtractor}
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            data={data}
            renderItem={renderItem}
            numColumns={numColumns}
            stickyHeaderIndices={stickyHeaderIndices}
            style={[style && style.flatListStyle ? style.flatListStyle : null]}
            onTouchStart={() => onTouchStart ? onTouchStart() : null}
            onTouchEnd={() => onTouchEnd ? onTouchEnd() : null}
            onTouchCancel={() => onTouchCancel ? onTouchCancel() : null}
            refreshControl={
                onRefresh ?
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh ? onRefresh() : null} />
                    : null
            }
            onScroll={(event) => {
                onScroll ? onScroll(event) : null
            }}
            scrollEnabled={scrollEnabled} />
    )
    
    return renderDom       
     
}

export default IList
