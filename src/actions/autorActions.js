import { FETCH_AUTOR, ADD_AUTOR, EDIT_AUTOR, DELETE_AUTOR } from "./types";

export const fetchAutores = () => dispatch => {
    fetch('localhost:8080/api/autor')
    .then(res => res.json())
    .then(autores => {
        autores = autores.map(autor => {
            const { id, name, email, sexo, pais, dataNascimento, cpf } = autor;
            return {
                id,
                name,
                email,
                sexo,
                pais,
                dataNascimento,
                cpf
            };
        });
        dispatch({
            type: FETCH_AUTOR,
            payload: autores
        });
    })
    .catch(err => console.log(err));
};

export const addEdit = (data) => dispatch => {
    if (!data[0].edit) {
        dispatch({
            type: ADD_AUTOR,
            payload: data
        });
    } else {
        dispatch({
            type: EDIT_AUTOR,
            payload: data
        });
    }
};

export const filtroAutor = (data) => dispatch => {
    fetch('localhost:8080/api/autor', { data })
    .then(res => res.json())
    .then(autores => {
        autores = autores.map(autor => {
            const { id, name, email, sexo, pais, dataNascimento, cpf } = autor;
            return {
                id,
                name,
                email,
                sexo,
                pais,
                dataNascimento,
                cpf
            };
        });
        dispatch({
            type: FETCH_AUTOR,
            payload: autores
        });
    })
    .catch(err => console.log(err));
};

export const removeAutor = (autorNameArr) => dispatch => {
    dispatch({
        type: DELETE_AUTOR,
        payload: autorNameArr 
    });
};
