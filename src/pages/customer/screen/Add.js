import React from 'react';
import { StyleSheet, View } from 'react-native';
import CTButtonGroup from '../container/CTButtonGroup';
import CTForm from '../container/CTForm';

const Index = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <CTForm />
            </View>
            <View style={styles.footer}>
                <CTButtonGroup screen={'add'} />
            </View>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F8F4',
    },
    content: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: '#F4F8F4',
    },
});