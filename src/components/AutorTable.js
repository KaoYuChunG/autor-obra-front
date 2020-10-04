import React from 'react';
import PropTypes from 'prop-types';

import SnackBar from './SnackBar';
import Search  from './Search';

import { connect } from 'react-redux';

import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

import { removeAutor } from '../actions/autorActions';
import { showSnackBar } from '../actions/utilActions';
import { isNotEmpty, stableSort, getSorting } from '../utils/utils';

const headRows = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'nome', numeric: false, disablePadding: true, label: 'Nome' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'sexo', numeric: false, disablePadding: false, label: 'Sexo' },
  { id: 'cpf', numeric: false, disablePadding: false, label: 'CPF' },
  { id: 'dataNascimento', numeric: false, disablePadding: false, label: 'Data de nascimento' },
  { id: 'paisOrigem', numeric: false, disablePadding: false, label: 'País' },
  { id: 'acao', numeric: false, disablePadding: false, label: 'Ação' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={ numSelected && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { selected } = props;
  const numSelected = selected.length;

  function handleDelete() {
    props.removeAutorCallback(selected);
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selecionado
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Autores
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filtro">
            <IconButton aria-label="Filtro">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '70%',
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  icon: {
    fontSize: 20
  }
}));

function ExtendedDataTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }

  if (isNotEmpty(props.newAutor)) {
    const autorID = props.autores.map(autor => +autor.id);
    let largest = Math.max(...autorID);
    const newAutor = props.newAutor.map((autor, index) => {
      return { ...autor, id: ++largest}
    })
    props.autores.unshift(...newAutor);
    props.newAutor.splice(0);
    handleOpen();
  } else if(isNotEmpty(props.editAutor)) {
    props.editAutor.forEach(editAutor => {
      props.autores.splice(props.autores.findIndex(autor => 
        autor.id === editAutor.id), 1, editAutor);
    })
    props.editAutor.splice(0);
    handleOpen();
  } else if (isNotEmpty(props.deleteAutor)) {
    props.deleteAutor.forEach(delAutor => {
      props.autores.splice(props.autores.findIndex(autor => 
        autor.name === delAutor), 1);
    })
    selected.splice(0);
    props.deleteAutor.splice(0);
    handleOpen();
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function handleAutorDelete(autorNameArr) {
    props.removeAutor(autorNameArr);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelection = props.autores.map(n => n.name);
      setSelected(newSelection);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.autores.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Search label1={'Nome'} label2={'Sexo'}/>
        <EnhancedTableToolbar selected={selected} removeAutorCallback={handleAutorDelete} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.autores.length}
            />
            <TableBody>
              {stableSort(props.autores, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" align="right" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.sexo}</TableCell>
                      <TableCell align="left">{row.cpf}</TableCell>
                      <TableCell align="left">{row.dataNascimento}</TableCell>
                      <TableCell align="left">{row.pais}</TableCell>
                      <TableCell align="center">
                        <Link to={{
                          pathname: '/add-edit-autor',
                          state: {
                            autor: row,
                            edit: true
                          }
                        }}>
                          <IconButton>
                              <EditIcon className={classes.icon}/>
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.autores.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <SnackBar
        open={open}
        handleClose={handleClose}
        variant={props.snackBarVariant}
        message={props.snackBarMessage}
      />
    </div>
  );
}

ExtendedDataTable.propTypes = {
    autores: PropTypes.array.isRequired,
    newAutor: PropTypes.array,
    editAutor: PropTypes.array,
    deleteAutor: PropTypes.array,
    removeAutor: PropTypes.func,
    showSnackBar: PropTypes.func,
    snackBarMessage: PropTypes.string,
    snackBarVariant: PropTypes.string
}

const mapStateToProps = state => ({
    autores: state.autores.all,
    newAutor: state.autores.new,
    editAutor: state.autores.edit,
    deleteAutor: state.autores.delete,
    snackBarMessage: state.autores.message,
    snackBarVariant: state.autores.variant
});

export default connect(mapStateToProps, { removeAutor, showSnackBar })(ExtendedDataTable);