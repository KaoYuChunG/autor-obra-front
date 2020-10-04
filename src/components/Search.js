import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      margin: 'auto',
    },
    iconButton: {
      padding: 10,
    },
  }));

  export default function Search(props) {
    const classes = useStyles();

    return (
      <Paper component="form" className={classes.root}>
        {props.children}
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }

