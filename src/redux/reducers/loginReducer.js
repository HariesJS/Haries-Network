import * as FileSystem from 'expo-file-system';
import { DB } from '../../components/db';

const GET_DATA = 'test-app/postReducer/GET-DATA';
const REMOVE_TODO = 'test-app/postRedcuer/REMOVE-TODO';
const SET_BOOKED = 'test-app/postReducer/SET-BOOKED';
const CREATE_POST = 'test-app/postReducer/CREATE-POST';
const CHANGE_ROOT = 'test-app/postReducer/CHANGE-ROOT';

const initialState = {
    data: [],
    root: {
        email: '',
        password: ''
    }
}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA: return { ...state, data: action.data };
        case REMOVE_TODO: return {
            ...state,
            data: state.data.filter(p => p.id !== action.id)
        };
        case SET_BOOKED: return {
            ...state,
            data: state.data.map(post => {
                if (post.id === action.id) {
                    post.booked = !post.booked;
                }
                return post;
            })
        };
        case CREATE_POST: return {
            ...state,
            data: [{ ...action.data }, ...state.data]
        };
        case CHANGE_ROOT: return {
            ...state,
            root: {
                email: action.email,
                password: action.password
            }
        };
        default: return state;
    }
}

export const changeRootCreator = (email, password) => ({ type: CHANGE_ROOT, email, password });

export const getDataThunk = () => async dispatch => {
    const login = await DB.getPosts();
    dispatch({
        type: GET_DATA,
        data: login
    })
};

export const removeDataThunk = id => async dispatch => {
    await DB.removePost(id);
    dispatch({ type: REMOVE_TODO, id })
};

export const createDataThunk = data => async (dispatch) => {
    const id = await DB.createPost(data);
    data.id = id;
    
    dispatch({ type: CREATE_POST, data });
};