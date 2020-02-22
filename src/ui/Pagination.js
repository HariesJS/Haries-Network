import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';

export const Pagination = ({ onPage }) => {
    const totalCount = useSelector(state => state.usersAPI.totalCount);
    const pageSize = useSelector(state => state.usersAPI.pageSize);
    
    const [value, setValue] = useState(null);

    const pages = [];
    
    const allPages = Math.ceil(totalCount / pageSize);

    const onChange = e => {
        Platform.OS === 'ios'
        ? setValue(e)
        : onPage(e);
    }

    for (let i = 1; i <= allPages; i++) {
        pages.push(i);
    }
    return (
        <RNPickerSelect
            doneText='Загрузить'
            placeholder={{ label: 'Выбрать страницу....' }}
            onDonePress={() => {
                if (value) {
                    onPage(value);
                }
            }}
            textInputProps={{ color: '#fff', textAlign: 'center' }}
            onValueChange={onChange}
            items={pages.map(page => ({
                label: page.toString(),
                value: page.toString()
            }))}
        />
    )
}