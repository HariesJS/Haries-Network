import React from 'react';
import { View, StyleSheet } from 'react-native';

export const HrLine = ({ prop }) => (
    <View style={prop ? styles.hr_line : styles.hr}></View>
)

const styles = StyleSheet.create({
    hr: {
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    hr_line: {
        backgroundColor: '#ccc',
        width: '100%',
        height: 1,
        marginTop: '10%'
    },
})