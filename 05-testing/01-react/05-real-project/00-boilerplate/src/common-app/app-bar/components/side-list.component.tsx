import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import * as classes from './side-list.styles';

interface Props {
  onClick: () => void;
  onKeyDown: () => void;
}

// TODO: Implement menu items
export const SideListComponent: React.FC<Props> = ({ onClick, onKeyDown }) => (
  <div
    className={classes.list}
    role="presentation"
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    <List>
      {['Calendario', 'Proyectos', 'Vacaciones'].map((text) => (
        <ListItem button key={text}>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </div>
);
