import { Ajax } from "../../ajax/ajax";

const GET_PROFILE = 'haries-network/profileReducer/GET-PROFILE';
const GET_OTHER_PROFILE = 'haries-network/profileReducer/GET-OTHER-PROFILE';
const SET_LOADING = 'haries-network/profileReducer/SET-LOADING';
const SET_OTHER_LOADING = 'haries-network/profileReducer/SET-OTHER-LOADING';
const SET_ERROR = 'haries-network/profileReducer/SET-ERROR';
const PUT_AVATAR = 'haries-network/profileReducer/PUT-AVATAR';
const GET_DEVELOPER = 'haries-network/profileReducer/GET-DEVELOPER';
const GET_ADMIN = 'haries-network/profileReducer/GET-ADMIN';

const initialState = {
    profile: null,
    otherProfile: null,
    loading: false,
    otherLoading: false,
    error: null,
    isDeveloper: [],
    isAdmin: []
}

function getProfileCase(state, name, action) {
    return {
        ...state,
        [name]: action
    };
}

async function getProfileWrapper(dispatch, id, TYPE, TYPE_LOADING, name) {
    dispatch({ type: TYPE_LOADING, loading: true });
    const response = await Ajax.getProfile(id);
    dispatch({ type: TYPE, [name]: response.data });
    dispatch({ type: TYPE_LOADING, loading: false });
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE: return getProfileCase(state, 'profile', action.profile);
        case GET_OTHER_PROFILE: return getProfileCase(state, 'otherProfile', action.otherProfile);
        case SET_LOADING: return { ...state, loading: action.loading };
        case SET_ERROR: return { ...state, error: action.error };
        case PUT_AVATAR: return {
            ...state,
            profile: { ...state.profile, photos: action.img }
        };
        case GET_DEVELOPER: return {
            ...state,
            isDeveloper: action.isDeveloper
        };
        case GET_ADMIN: return {
            ...state,
            isAdmin: action.isAdmin
        };
        default: return state;
    }
}

export const setErrorCreator = error => ({ type: SET_ERROR, error });

export const getOtherProfileThunk = id => dispatch => {
    getProfileWrapper(dispatch, id, GET_OTHER_PROFILE, SET_OTHER_LOADING, 'otherProfile');
}

export const getProfileThunk = id => dispatch => {
    getProfileWrapper(dispatch, id, GET_PROFILE, SET_LOADING, 'profile');
}

export const postProfileThunk = profile => async (dispatch, getState) => {
    const response = await Ajax.putProfile(profile);
    if (response.data.resultCode === 0) {
        dispatch(getProfileThunk(getState().authAPI.data.id));
    } else {
        if (response.data.messages.length) {
            dispatch(setErrorCreator(response.data.messages[0]));
        }
    }
}

export const putAvatarThunk = img => async dispatch => {
    const response = await Ajax.putAvatar(img);
    if (response.data.resultCode === 0) {
        dispatch({
            type: PUT_AVATAR,
            img: response.data.data.photos
        });
    }
}

async function getFireBaseAPI(request, TYPE, isValue, dispatch) {
    const response = await request();
    const data = Object.keys(response.data).map(e => ({ id: response.data[e], key: e }));
    dispatch({ type: TYPE, [isValue]: data });
}

export const getIsDeveloperThunk = () => async dispatch => {
    getFireBaseAPI(Ajax.getTechAdmin, GET_DEVELOPER, 'isDeveloper', dispatch);
}

export const getAdminThunk = () => async dispatch => {
    getFireBaseAPI(Ajax.getAdmin, GET_ADMIN, 'isAdmin', dispatch);
}

export const setAdminThunk = id => async dispatch => {
    await Ajax.postAdmin(id);
    dispatch(getAdminThunk());
}

export const deleteAdminThunk = key => async dispatch => {
    await Ajax.deleteAdmin(key);
    dispatch(getAdminThunk());
}