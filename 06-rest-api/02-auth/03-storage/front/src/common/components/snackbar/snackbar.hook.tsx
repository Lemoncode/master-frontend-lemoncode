import React from 'react';
import { SnackbarContext } from './snackbar.context';
import { Variant } from './snackbar.vm';

export const useSnackbarContext = () => {
  const { setOptions, setOpen } = React.useContext(SnackbarContext);

  return {
    showMessage: (message: string, variant: Variant) => {
      setOptions({ message, variant });
      setOpen(true);
    },
  };
};
