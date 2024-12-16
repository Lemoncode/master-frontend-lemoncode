import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
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
        <ListItemButton key={text}>
          <ListItemText primary={text} />
        </ListItemButton>
      ))}
    </List>
  </div>
);
