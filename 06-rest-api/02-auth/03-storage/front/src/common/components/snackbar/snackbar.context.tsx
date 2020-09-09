import React from 'react';
import { SnackbarOptions } from './snackbar.vm';

interface Context {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: (event?: React.SyntheticEvent, reason?: string) => void;
  options: SnackbarOptions;
  setOptions: (options: SnackbarOptions) => void;
}

export const SnackbarContext = React.createContext<Context>(null);

export const SnackbarProvider: React.FunctionComponent = props => {
  const { children } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<SnackbarOptions>({
    message: '',
    variant: 'success',
  });

  const handleClose = (_, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        open,
        setOpen,
        onClose: handleClose,
        options,
        setOptions,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};
