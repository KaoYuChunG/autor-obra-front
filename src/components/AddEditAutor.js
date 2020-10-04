import React, { Component } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEdit } from '../actions/autorActions';
import { TextField, Button } from '@material-ui/core';
import { isBrasil, sexo } from '../utils/utils';

import SnackBar from './SnackBar';

const schema = Yup.object().shape({
  name: Yup.string().max(100).required('Nome é obrigatório'),
  email: Yup.string()
    .email('E-mail não válido')
    .required('E-mail é obrigatório'),
  pais: Yup.string().max(30).required('País de origem é obrigatório'),
  dataNascimento: Yup.string()
    .max(20)
    .required('Data de nascimento é obrigatório')
});

class AddEditAutor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autor: {
        id: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.id : null,
        name: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.name : '',
        email: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.email : '',
        sexo: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.phone : '',
        dataNascimento: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.website : '',
        pais: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.website : '',
        cpf: this.props.location.state && this.props.location.state.autor ? this.props.location.state.autor.website : '',
        edit: this.props.location.state && this.props.location.state.autor ? this.props.location.state.edit : false
      },
      open: false
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({open: false});
  }

  render() {
    return (
      <Route render={ ({history}) => (
        <div>
          <Formik
          initialValues={this.state.autor}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              history.push('/');
              this.state.autor.id ? this.props.addNew([{...values, id: this.state.autor.id }]) : this.props.addNew([values])
            }, 100);
          }}
          validationSchema={schema}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = props;
            return (
              <form
                onSubmit={handleSubmit}
                style={{ width: '30%', margin: 'auto' }}
              >
                <TextField
                  id="standard-name"
                  type="text"
                  name="name"
                  label="Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.name && touched.name && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.name}
                  </div>
                )}

                <TextField
                  id="standard-sexo"
                  select
                  name="sexo"
                  label="Sexo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.sexo}
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  >
                  {sexo.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                {errors.sexo && touched.sexo && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.sexo}
                  </div>
                )}

                <TextField
                  id="standard-email"
                  type="email"
                  name="email"
                  label="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.email && touched.email && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.email}
                  </div>
                )}
  
                <TextField
                  id="standard-nascimento"
                  type="text"
                  name="dataNascimento"
                  label="Data de Nascimento"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataNascimento}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.dataNascimento && touched.dataNascimento && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.dataNascimento}
                  </div>
                )}
  
                <TextField
                  id="standard-pais"
                  type="text"
                  name="pais"
                  label="Pais de origem"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.pais}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.pais && touched.pais && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.pais}
                  </div>
                )}
                {isBrasil(values.pais) && (
                  <TextField
                  id="standard-cpf"
                  name="cpf"
                  label="CPF"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.cpf}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  />)}
               
                {errors.cpf && touched.cpf && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.cpf}
                  </div>
                )}
  
                <Button
                  disabled={!dirty && !isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: '1em', float: 'right' }}
                >
                  {this.state.autor.edit ? 'Atualizar' : 'Salvar'}
                </Button>
              </form>
            );
          }}
        </Formik>
        <SnackBar
          open={this.state.open}
          handleClose={this.handleClose}
          variant="success"
          message="Autor criado com sucesso"
        />
      </div>
      )} />
    );
  }
}

AddEditAutor.propTypes = {
  addNew: PropTypes.func,
  snackBarMessage: PropTypes.string,
  snackBarVariant: PropTypes.string
};

const mapStateToProps = state => ({
  snackBarMessage: state.utils.message,
  snackBarVariant: state.utils.variant
})

export default connect(
  mapStateToProps,
  { addNew: addEdit }
)(AddEditAutor);
