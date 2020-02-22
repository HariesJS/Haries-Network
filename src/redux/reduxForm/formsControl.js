import React from 'react';
import { TextInput, StyleSheet, Dimensions } from 'react-native';

export const InputRender = props => {
    const { meta: { touched, error } } = props;
    const hasError = touched && error;
    
    return (
        <TextInput style={
            hasError
            ? {
                ...styles.input,
                borderBottomColor: 'red',
                borderBottomWidth: 3,
                borderStyle: 'solid'
            } : { ...styles.input }
            } { ...props.input } { ...props }
        />
    )
}

const styles = StyleSheet.create({
    block: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        padding: '3%',
        marginHorizontal: '25%',
        elevation: 8,
        shadowOpacity: 2,
        shadowOffset: {},
        borderBottomColor: '#3959ab',
        borderBottomWidth: 3,
        borderStyle: 'solid'
    },
    rememberBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: Dimensions.get('window').height / 150,
    },
    rememberMe: {
        color: '#fff'
    }
})