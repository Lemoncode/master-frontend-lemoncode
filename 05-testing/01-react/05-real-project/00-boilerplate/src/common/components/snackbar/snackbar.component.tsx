import React from 'react';
import {
  Snackbar,
  SnackbarOrigin,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SnackbarContext } from './snackbar.context';
import * as classes from './snackbar.styles';

interface Props {
  autoHideDuration?: number;
  position?: SnackbarOrigin;
}

export const SnackbarComponent: React.FunctionComponent<Props> = (props) => {
  const { position, autoHideDuration } = props;
  const { open, onClose, options } = React.useContext(SnackbarContext);

  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes[options.variant]}
        message={options.message}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

SnackbarComponent.defaultProps = {
  position: {
    horizontal: 'right',
    vertical: 'top',
  },
  autoHideDuration: 3000,
};
