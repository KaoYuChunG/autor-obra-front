import { FETCH_OBRA, ADD_OBRA, EDIT_OBRA, DELETE_OBRA } from "./types";

export const fetchUsers = () => dispatch => {
    fetch('https://jsonplaceholder.typicode.com/users')
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
            type: FETCH_OBRA,
            payload: users
        });
    })
    .catch(err => console.log(err));
};

export const addEditUsers = (userData) => dispatch => {
    if (!userData[0].edit) {
        dispatch({
            type: ADD_OBRA,
            payload: userData
        });
    } else {
        dispatch({
            type: EDIT_OBRA,
            payload: userData
        });
    }
};

export const removeUsers = (usersNameArr) => dispatch => {
    dispatch({
        type: DELETE_OBRA,
        payload: usersNameArr 
    });
};
