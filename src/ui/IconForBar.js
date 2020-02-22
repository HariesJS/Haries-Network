import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export const IconForBar = ({ name, info }) => (
    <Ionicons
        name={name}
        color={info.tintColor}
        size={Platform.OS === 'ios' ? 40 : 25}
    />
)