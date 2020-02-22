import { Ajax } from '../../ajax/ajax';
import { stopSubmit } from 'redux-form';

const GET_AUTH = 'haries-network/authReducer/GET-AUTH';
const SET_LOADING = 'haries-network/authReducer/SET-LOADING';
const GET_CAPTCHA_URL = 'haries-network/authReducer/GET-CAPTCHA-URL';

const initialState = {
    data: {
        isAuth: false
    },
    captcha: null,
    loading: false
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AUTH: return {
            ...state,
            data: { ...action.data, isAuth: action.isAuth }
        };
        case GET_CAPTCHA_URL: return { ...state, captcha: action.url }
        case SET_LOADING: return { ...state, loading: action.loading };
        default: return state;
    }
}

const setLoadCreator = loading => ({ type: SET_LOADING, loading });
export const setCaptchaCreator = url => ({ type: GET_CAPTCHA_URL, url });

export const getAuthThunk = () => async dispatch => {
    const response = await Ajax.getAuth();
    if (response.data.resultCode === 0) {
        const { id, login, email } = response.data.data;
        dispatch({
            type: GET_AUTH,
            data: { id, login, email },
            isAuth: true
        });
    }
}

export const postAuthThunk = (email, password, captcha) => {
    return async dispatch => {
        try {
            dispatch(setLoadCreator(true));
            const response = await Ajax.postAuth(email, password, captcha);
            if (response.data.resultCode === 0) {
                dispatch(getAuthThunk());
            } else {
                if (response.data.resultCode === 10) {
                    const response = await Ajax.getCaptcha();
                    dispatch(setCaptchaCreator(response.data.url));
                }
                dispatch(stopSubmit('authpage', { _error: response.data.messages[0] }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoadCreator(false));
        }
    }
}

export const logoutAuthThunk = () => async dispatch => {
    const response = await Ajax.deleteAuth();
    if (response.data.resultCode === 0) {
        dispatch({
            type: GET_AUTH,
            data: null,
            isAuth: false
        });
    }
}