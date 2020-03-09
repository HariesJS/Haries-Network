import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export const Block = ({ title, value, style, color = 'black' }) => (
    <View style={styles.social_block}>
        <Text style={{ textTransform: 'uppercase', ...style }}>{title}</Text>
        <Text style={{ color, paddingHorizontal: Dimensions.get('window').width / 200 }}>{value}</Text>
    </View>
)

const styles = StyleSheet.create({
    social_block: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})