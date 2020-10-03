import { FETCH_AUTOR, ADD_AUTOR, EDIT_AUTOR, DELETE_AUTOR } from "../actions/types";

const initialState = {
    all: [],
    message: "Default",
    variant: "success"
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_AUTOR:
            return {
                ...state,
                all: action.payload
            }
        case ADD_AUTOR:
            return {
                ...state,
                new: action.payload,
                message: "Autor cadastrado",
                variant: "success"
            }
        case EDIT_AUTOR:
            return {
                ...state,
                edit: action.payload,
                message: "Autor atualizado com sucesso",
                variant: "info"
            }
        case DELETE_AUTOR:
            return {
                ...state,
                delete: action.payload,
                message: "Autor deletado com sucesso",
                variant: "error"
            }
        default:
            return state;
    }
}