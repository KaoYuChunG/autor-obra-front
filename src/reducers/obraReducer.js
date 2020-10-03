import { FETCH_OBRA, ADD_OBRA, EDIT_OBRA, DELETE_OBRA } from "../actions/types";

const initialState = {
    all: [],
    message: "Default",
    variant: "success"
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_OBRA:
            return {
                ...state,
                all: action.payload
            }
        case ADD_OBRA:
            return {
                ...state,
                new: action.payload,
                message: "Obra criado com sucesso",
                variant: "success"
            }
        case EDIT_OBRA:
            return {
                ...state,
                edit: action.payload,
                message: "Obra atualizado com sucesso",
                variant: "info"
            }
        case DELETE_OBRA:
            return {
                ...state,
                delete: action.payload,
                message: "Obra deletado com sucesso",
                variant: "error"
            }
        default:
            return state;
    }
}