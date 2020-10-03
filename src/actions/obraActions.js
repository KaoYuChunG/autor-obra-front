import { FETCH_OBRA, ADD_OBRA, EDIT_OBRA, DELETE_OBRA } from "./types";

export const fetchObras = () => dispatch => {
    fetch('localhost:8080/api/obra')
    .then(res => res.json())
    .then(users => {
        users = users.map(user => {
            const { id, name, descricao, dataPublicacao, dataExposicao } = user;
            return {
                id,
                name,
                descricao,
                dataPublicacao,
                dataExposicao
            };
        });
        dispatch({
            type: FETCH_OBRA,
            payload: users
        });
    })
    .catch(err => console.log(err));
};

export const addEdit = (data) => dispatch => {
   
    if (!data[0].edit) {
        dispatch({
            type: ADD_OBRA,
            payload: data
        });
    } else {
        dispatch({
            type: EDIT_OBRA,
            payload: data
        });
    }
};

export const removeObras = (obraNameArr) => dispatch => {
    dispatch({
        type: DELETE_OBRA,
        payload: obraNameArr 
    });
};
