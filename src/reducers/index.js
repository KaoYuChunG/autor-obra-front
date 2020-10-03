import { combineReducers } from 'redux';
import autorReducer from './autorReducer';
import obraReducer from './obraReducer';
import utilReducer from './utilReducer';

export default combineReducers({
    autores: autorReducer,
    obras: obraReducer,
    utils: utilReducer
});