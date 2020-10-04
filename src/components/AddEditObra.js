import React, { Component } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEdit } from '../actions/obraActions';
import { TextField, Button } from '@material-ui/core';

import SnackBar from './SnackBar';

class AddEditObra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obra: {
        id: this.props.location.state && this.props.location.state.obra ? this.props.location.state.obra.id : null,
        name: this.props.location.state && this.props.location.state.obra ? this.props.location.state.obra.name : '',
        descricao: this.props.location.state && this.props.location.state.obra ? this.props.location.state.obra.descricao : '',
        dataPublicacao: this.props.location.state && this.props.location.state.obra ? this.props.location.state.obra.dataPublicacao : '',
        dataExposicao: this.props.location.state && this.props.location.state.obra ? this.props.location.state.obra.dataExposicao : '',
        edit: this.props.location.state && this.props.location.state.obra ? this.props.location.state.edit : false
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
          initialValues={this.state.obra}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              history.push('/obras');
              this.state.obra.id ? this.props.addNew([{...values, id: this.state.obra.id }]) : this.props.addNew([values])
            }, 100);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Nome é obrigatório'),
            descricao: Yup.string()
              .required('Descrição é obrigatório')
              .max(500),
            dataPublicacao: Yup.string()
              .required('Data de Publicação é obrigatório'),
            dataExposicao: Yup.string()
              .required('Data de Exposicação é obrigatório')
          })}
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
                  id="standard-descricao"
                  type="text"
                  name="descricao"
                  label="Descrição"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.descricao}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.descricao && touched.descricao && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.descricao}
                  </div>
                )}
  
                <TextField
                  id="standard-dataPublicacao"
                  type="text"
                  name="dataPublicacao"
                  label="Data de Publicação"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataPublicacao}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.dataPublicacao && touched.dataPublicacao && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.dataPublicacao}
                  </div>
                )}
  
                <TextField
                  id="standard-dataExposicao"
                  type="text"
                  name="dataExposicao"
                  label="Data de Exposição"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataExposicao}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.dataExposicao && touched.dataExposicao && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.dataExposicao}
                  </div>
                )}
  
                <Button
                  disabled={!dirty && !isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: '1em', float: 'right' }}
                >
                  {this.state.obra.edit ? 'Atualizar' : 'Salvar'}
                </Button>
              </form>
            );
          }}
        </Formik>
        <SnackBar
          open={this.state.open}
          handleClose={this.handleClose}
          variant="success"
          message="Obra criado com sucesso"
        />
      </div>
      )} />
    );
  }
}

AddEditObra.propTypes = {
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
)(AddEditObra);
