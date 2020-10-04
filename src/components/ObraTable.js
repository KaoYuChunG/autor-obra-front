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
import EditIcon from '@material-ui/icons/Edit';
import InputBase from '@material-ui/core/InputBase';
import { Link } from 'react-router-dom';

import { removeObras } from '../actions/obraActions';
import { filtroObra } from '../actions/obraActions';
import { showSnackBar } from '../actions/utilActions';
import { isNotEmpty, stableSort, getSorting } from '../utils/utils';

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'nome', numeric: false, disablePadding: false, label: 'Nome' },
  { id: 'descricao', numeric: false, disablePadding: false, label: 'Descrição' },
  { id: 'dataPublicacao', numeric: false, disablePadding: false, label: 'Data de publicação' },
  { id: 'dataExposicao', numeric: false, disablePadding: false, label: 'Data de exposição' },
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
            checked={numSelected && numSelected === rowCount}
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
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { selected } = props;
  const numSelected = selected.length;

  function handleDelete() {
    props.removeObraCallback(selected);
  }

  function handleFiltro(){
    props.filtroAutor();
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
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Obras
          </Typography>
        )}
      </div>
      <Search handleFiltro={handleFiltro}>
        <InputBase
          id="standard-name"
          type="text"
          name="name"
          label="Name"
          className={classes.input}
          placeholder={'Nome'}
          inputProps={{ 'aria-label': 'Nome' }}
        />
        <InputBase
          id="standard-descricao"
          type="text"
          name="descricao"
          label="Descrição"
          className={classes.input}
          placeholder={'Descrição'}
          inputProps={{ 'aria-label': 'Descricao'}}
        />
      </Search>
      <div className={classes.actions}>
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete} aria-label="delete">
              <DeleteIcon />
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

  if (isNotEmpty(props.new)) {
    const obraID = props.obras.map(obra => +obra.id);
    let largest = Math.max(...obraID);
    const newObra = props.new.map((obra, index) => {
      return { ...obra, id: ++largest}
    })
    props.obras.unshift(...newObra);
    props.new.splice(0);
    handleOpen();
  } else if(isNotEmpty(props.edit)) {
    props.edit.forEach(editObra => {
      props.obras.splice(props.obras.findIndex(obra => 
        obra.id === editObra.id), 1, editObra);
    })
    props.edit.splice(0);
    handleOpen();
  } else if (isNotEmpty(props.delete)) {
    props.delete.forEach(delObra => {
      props.obras.splice(props.obras.findIndex(obra => 
        obra.name === delObra), 1);
    })
    selected.splice(0);
    props.delete.splice(0);
    handleOpen();
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function handleObraDelete(obraNameArr) {
    props.removeObras(obraNameArr);
  }

  function handleAutorFiltro(filtro) {
    props.filtroAutor(filtro);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelection = props.obras.map(n => n.name);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.obras.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar selected={selected} 
          removeObraCallback={handleObraDelete}
          filtroAutor={handleAutorFiltro} 
        />
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
              rowCount={props.obras.length}
            />
            <TableBody>
              {stableSort(props.obras, getSorting(order, orderBy))
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
                      <TableCell component="th" align="center" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.descricao}</TableCell>
                      <TableCell align="left">{row.dataPublicacao}</TableCell>
                      <TableCell align="left">{row.dataExposicao}</TableCell>
                      <TableCell align="center">
                        <Link to={{
                          pathname: '/add-edit-obra',
                          state: {
                            obra: row,
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
          count={props.obras.length}
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
    obras: PropTypes.array.isRequired,
    new: PropTypes.array,
    edit: PropTypes.array,
    delete: PropTypes.array,
    remove: PropTypes.func,
    showSnackBar: PropTypes.func,
    snackBarMessage: PropTypes.string,
    snackBarVariant: PropTypes.string
}

const mapStateToProps = state => ({
    obras: state.obras.all,
    new: state.obras.new,
    edit: state.obras.edit,
    delete: state.obras.delete,
    snackBarMessage: state.obras.message,
    snackBarVariant: state.obras.variant
});

export default connect(mapStateToProps, { removeObras, filtroObra, showSnackBar })(ExtendedDataTable);