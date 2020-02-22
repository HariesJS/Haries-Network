import { Ajax } from "../../ajax/ajax";

const SET_LOADING = 'haries-network/dialogsReducer/SET-LOADING';
const GET_DIALOGS = 'haries-network/dialogsReducer/GET-GET_DIALOGS';
const GET_DIALOG = 'haries-network/dialogsReducer/GET-DIALOGS';
const POST_MESSAGE = 'haries-network/dialogsReducer/POST-MESSAGE';

const initialState = {
    dialogs: [],
    dialog: [],
    isLoad: false
}

export const dialogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DIALOGS: return {
            ...state,
            dialogs: action.dialogs
        };
        case GET_DIALOG: return {
            ...state,
            dialog: action.dialog
        };
        case SET_LOADING: return {
            ...state,
            isLoad: action.loading
        };
        case POST_MESSAGE: return {
            ...state,
            dialog: [...state.dialog, {
                id: Date.now().toString(),
                body: action.message,
                addedAt: new Date()
            }]
        };
        default: return state;
    }
}

const setLoadingCreator = loading => ({ type: SET_LOADING, loading });

async function dialogsThunk(dispatch, request, TYPE, option, param, id) {
    dispatch(setLoadingCreator(true));
    const response = await request(id);
    dispatch({ type: TYPE, [option]: param ? response.data.items : response.data });
    dispatch(setLoadingCreator(false));
}

export const getDialogsThunk = () => async dispatch => {
    dialogsThunk(dispatch, Ajax.getMessages, GET_DIALOGS, 'dialogs', false);
}

export const getDialogThunk = id => async dispatch => {
    dialogsThunk(dispatch, Ajax.getDialog, GET_DIALOG, 'dialog', true, id);
}

export const postMessageThunk = (id, message) => async dispatch => {
    const response = await Ajax.postMessage(id, message);
    if (response.data.resultCode === 0) {
        dispatch({ type: POST_MESSAGE, message });
    }
}