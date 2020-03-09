import React from 'react';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export const LeftAction = ({ progress, dragX, onPress, name, icon, color }) => {
    const scale = dragX.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ ...styles.view, backgroundColor: color }}>
            <View style={styles.viewAlign}>
                <AntDesign name={icon} color='#fff' size={24} />
                <Animated.Text style={[styles.text, { transform: [{ scale }]}]}
                >
                    {name}
                </Animated.Text>
            </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        height: '100%',
        padding: 10
    },
    viewAlign: {
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontWeight: '600',
    }
})