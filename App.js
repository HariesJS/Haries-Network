import React, { Fragment, useEffect } from 'react';
import AppNavigation from './src/ui/AppNavigation';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './src/redux/store/store';
import Login from './src/components/Login';
import { getAuthThunk } from './src/redux/reducers/authReducer';
import { Root } from 'native-base';
import { getOnlineThunk } from './src/redux/reducers/usersReducer';
import { getIsDeveloperThunk, getAdminThunk } from './src/redux/reducers/profileReducer';

function AppWrap() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.authAPI.data);

    useEffect(() => {
        dispatch(getAuthThunk());
        dispatch(getOnlineThunk());
        dispatch(getIsDeveloperThunk());
        dispatch(getAdminThunk());
    }, [dispatch]);

    return (
        <Fragment>{
            data.isAuth ? <AppNavigation /> : <Login />
        }</Fragment>
    )
}

export default function App() {
    return (
        <Root>
            <Provider store={store}>
                <AppWrap />
            </Provider>
        </Root>
    )
}