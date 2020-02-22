import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

export const AppHeaderIcons = props => (
    <HeaderButton
        IconComponent={Ionicons}
        iconSize={24}
        color='#fff'
        {...props}
    />
);