import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { SideListComponent } from './side-list.component';

interface Props {
  open: boolean;
  onClick: () => void;
}

export const SideMenuComponent: React.FC<Props> = ({ open, onClick }) => (
  <Drawer open={open} onClose={onClick}>
    <SideListComponent onClick={onClick} onKeyDown={onClick} />
  </Drawer>
);
