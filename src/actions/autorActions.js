import { FETCH_AUTOR, ADD_AUTOR, EDIT_AUTOR, DELETE_AUTOR } from "./types";

export const fetchUsers = () => dispatch => {
    fetch('localhost:8080/api/autor')
    .then(res => res.json())
    .then(users => {
        users = users.map(user => {
            const { id, name, email, phone, website } = user;
            return {
                id,
                name,
                email,
                phone,
                website
            };
        });
        dispatch({
            type: FETCH_AUTOR,
            payload: users
        });
    })
    .catch(err => console.log(err));
};

export const addEditUsers = (userData) => dispatch => {
    if (!userData[0].edit) {
        dispatch({
            type: ADD_AUTOR,
            payload: userData
        });
    } else {
        dispatch({
            type: EDIT_AUTOR,
            payload: userData
        });
    }
};

export const removeUsers = (usersNameArr) => dispatch => {
    dispatch({
        type: DELETE_AUTOR,
        payload: usersNameArr 
    });
};
