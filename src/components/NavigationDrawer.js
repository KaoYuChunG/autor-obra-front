import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import GroupIcon from '@material-ui/icons/Group';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import AutorTable from './AutorTable';
import ObraTable from './ObraTable';
import AddEditAutor from './AddEditAutor';
import AddEditObra from './AddEditObra';

import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAutores } from '../actions/autorActions';
import { fetchObras } from '../actions/obraActions';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const aba = [
  { label:'Autores', url: '/' },
  { label:'Add autor', url: '/add-edit-autor' }, 
  { label:'Obras', url: '/obras' }, 
  { label:'Add obra', url: '/add-edit-obra' }
]

export const icone = index => {
  return [ <GroupIcon />, <PersonAddIcon />, <LibraryBooks />, <PlaylistAdd />]
  .filter((e, i) => i === index);
}

function NavigationDrawer(props) {
  const { container } = props;
  props.fetchAutores();
  props.fetchObras();
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
          <List>
            {aba.map((text, index) => (
                <Link to={text.url} key={index} style={{ textDecoration: 'none', color: 'black'}}>
                    <ListItem button key={index}>
                        <ListItemIcon >{icone(index)}</ListItemIcon>
                        <ListItemText primary={text.label} />
                    </ListItem>
                </Link>
            ))}
          </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            LIVRARIA
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route exact path="/" component={AutorTable} />
        <Route  path="/obras" component={ObraTable} />
        <Route exact path="/add-edit-autor" component={AddEditAutor} />
        <Route exact path="/add-edit-obra" component={AddEditObra} />
      </main>
    </div>
  );
}

NavigationDrawer.propTypes = {
  container: PropTypes.object,
  fetchAutores: PropTypes.func.isRequired,
  fetchObras: PropTypes.func.isRequired
};

export default connect(null, { fetchAutores, fetchObras })(NavigationDrawer);
