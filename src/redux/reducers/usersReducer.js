import { Ajax } from "../../ajax/ajax";

const GET_USERS = 'haries-network/usersReducer/GET-USERS';
const LOAD_MORE = 'haries-network/usersReducer/LOAD-MORE';
const FOLLOW_USER = 'haries-network/usersReducer/FOLLOW-USER';
const SET_LOADING = 'haries-network/usersReducer/SET-LOADING';
const GET_ONLINE = 'haries-network/usersReducer/GET-ONLINE';
const SET_CURRENT_PAGE = 'haries-network/usersReducer/SET-CURRENT-PAGE';
const GET_TOTAL_COUNT = 'haries-network/usersReducer/GET-TOTAL-COUNT';

const initialState = {
    users: [],
    pageSize: 10,
    loading: false,
    isOnline: [],
    currentPage: 2,
    totalCount: null
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS: return {
            ...state,
            users: action.users
        };
        case LOAD_MORE: return {
            ...state,
            users: [...state.users, ...action.more]
        };
        case FOLLOW_USER: return {
            ...state,
            users: state.users.map(user => {
                if (user.id === action.id) {
                    user.followed = !user.followed;
                }
                return user;
            })
        };
        case SET_LOADING: return {
            ...state,
            loading: action.loading
        };
        case GET_ONLINE: return {
            ...state,
            isOnline: action.isOnline
        };
        case SET_CURRENT_PAGE: return {
            ...state,
            currentPage: action.page
        };
        case GET_TOTAL_COUNT: return {
            ...state,
            totalCount: action.count
        };
        default: return state;
    }
}

export const setCurrentPageCreator = page => ({ type: SET_CURRENT_PAGE, page });
const setLoaderCreator = loading => ({ type: SET_LOADING, loading });

export const getUsersThunk = page => async (dispatch, getState) => {
    const response = await Ajax.getUsers(page, getState().usersAPI.pageSize);
    dispatch({
        type: GET_USERS,
        users: response.data.items
    });
    dispatch({ type: GET_TOTAL_COUNT, count: response.data.totalCount });
}

export const loadMoreThunk = page => async (dispatch, getState) => {
    const response = await Ajax.getUsers(page, getState().usersAPI.pageSize);
    dispatch({
        type: LOAD_MORE,
        more: response.data.items
    });
}

async function followThunk(request, id, dispatch) {
    try {
        dispatch(setLoaderCreator(true));
        const response = await request(id);
        if (response.data.resultCode === 0) {
            dispatch({ type: FOLLOW_USER, id });
        }
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setLoaderCreator(false));
    }
}

export const followUserThunk = id => async dispatch => {
    followThunk(Ajax.postFollow, id, dispatch);
}

export const unfollowUserThunk = id => async dispatch => {
    followThunk(Ajax.deleteFollow, id, dispatch);
}

export const getOnlineThunk = () => async dispatch => {
    const response = await Ajax.getOnline();
    const data = Object.keys(response.data).map(e => ({ id: response.data[e], key: e }));
    dispatch({ type: GET_ONLINE, isOnline: data });
}

export const postOnlineThunk = id => async dispatch => {
    await Ajax.setOnline(id);
    dispatch(getOnlineThunk());
}

export const deleteOnlineThunk = key => async dispatch => {
    await Ajax.setOffline(key);
    dispatch(getOnlineThunk());
}