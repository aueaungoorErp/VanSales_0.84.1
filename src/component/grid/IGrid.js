import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { SuperGridSectionList } from 'react-native-super-grid'

const IGrid = (props) => {
    const { itemDimension, sections, renderItem, renderSectionHeader, style} = props
    return (
        <SuperGridSectionList
            itemDimension={itemDimension}
            sections={sections}
            style={[styles.gridView, style && style.gridView ? style.gridView : null ]}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
              <Text style={{ color: 'green' }}>{section.title}</Text>
            )}
        />
    )
}

export default IGrid

const styles = StyleSheet.create({
    gridView: {
      // paddingTop: 25, 
      // borderWidth: 1,
      flex: 1,
    }
  });