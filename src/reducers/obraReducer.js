import { FETCH_OBRA, ADD_OBRA, EDIT_OBRA, DELETE_OBRA } from "../actions/types";

const initialState = {
    allUsers: [],
    message: "Default",
    variant: "success"
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_OBRA:
            return {
                ...state,
                allUsers: action.payload
            }
        case ADD_OBRA:
            return {
                ...state,
                newUsers: action.payload,
                message: "New Users Added",
                variant: "success"
            }
        case EDIT_OBRA:
            return {
                ...state,
                editUsers: action.payload,
                message: "Users Edited Successfully",
                variant: "info"
            }
        case DELETE_OBRA:
            return {
                ...state,
                deleteUsers: action.payload,
                message: "User Deleted Successfully",
                variant: "error"
            }
        default:
            return state;
    }
}