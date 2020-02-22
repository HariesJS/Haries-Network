import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export const Preloader = ({ color = '#3959ab' }) => (
    <View style={styles.loader}>
        <ActivityIndicator
            size='large'
            color={color}
        />
    </View>
)

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})