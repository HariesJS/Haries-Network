import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import { usersReducer } from '../reducers/usersReducer';
import { profileReducer } from '../reducers/profileReducer';
import { authReducer } from '../reducers/authReducer';
import { dialogsReducer } from '../reducers/dialogsReducer';
import { loginReducer } from '../reducers/loginReducer';

const reducers = combineReducers({
    form: formReducer,
    usersAPI: usersReducer,
    profileAPI: profileReducer,
    authAPI: authReducer,
    dialogsAPI: dialogsReducer,
    loginAPI: loginReducer
})

export default createStore(reducers, applyMiddleware(thunk));