import React, { useState } from 'react';
import { Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';

export const Search = ({ option }) => {
    const [search, setSearch] = useState('');

    const platform = Platform.OS === 'ios';

    const icons = {
        size: 24,
        color: option ? '#3959ab' : platform ? 'gray' : '#fff'
    }

    return (
        <SearchBar
            platform={platform ? 'ios' : 'android'}
            round
            cancelButtonTitle='Отменить'
            value={search}
            onChangeText={setSearch}
            lightTheme
            containerStyle={{
                backgroundColor: option ? '#fff' : 'rgba(57,89,171,0.9)',
            }}
            cancelButtonProps={{
                buttonTextStyle: {
                    color: option ? '#3959ab' : '#fff'
                }
            }}
            cancelIcon={icons}
            clearIcon={icons}
            searchIcon={icons}
            showLoading={false}
            inputStyle={{
                color: option ? '#000' : platform ? '#000' : '#fff',
            }}
            placeholder='Поиск...'
        />
    )
}