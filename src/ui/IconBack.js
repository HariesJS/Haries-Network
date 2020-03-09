import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from './AppHeaderIcons';

export const IconBack = ({ nav }) => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
        <Item
            title='edit-back'
            iconName='ios-arrow-back'
            onPress={() => nav.goBack()}
        />
    </HeaderButtons>
)