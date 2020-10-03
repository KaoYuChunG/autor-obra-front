import { FETCH_AUTOR, ADD_AUTOR, EDIT_AUTOR, DELETE_AUTOR } from "../actions/types";

const initialState = {
    allUsers: [],
    message: "Default",
    variant: "success"
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_AUTOR:
            return {
                ...state,
                allUsers: action.payload
            }
        case ADD_AUTOR:
            return {
                ...state,
                newUsers: action.payload,
                message: "New Users Added",
                variant: "success"
            }
        case EDIT_AUTOR:
            return {
                ...state,
                editUsers: action.payload,
                message: "Users Edited Successfully",
                variant: "info"
            }
        case DELETE_AUTOR:
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