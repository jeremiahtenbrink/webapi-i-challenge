import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, createStyles, List, ListItem, ListItemAvatar, withStyles} from '@material-ui/core';
import {user} from '../interfaces/UserInterface';


type props = {
    user: user
}

const UserListItem  = ({user}: props) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar alt={user.name} src={user.avatarSrc}>

                </Avatar>
            </ListItemAvatar>
        </ListItem>
    );
};


// Non-dependent styles
const styles = createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export default withStyles(styles)(UserListItem);
