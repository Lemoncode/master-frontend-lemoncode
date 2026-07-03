import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { Modal } from '@mui/material';
import { ScaleLoader as Loader } from 'react-spinners';
import * as classes from './spinner.styles';

export const SpinnerComponent: React.FunctionComponent = () => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <Modal open={promiseInProgress} className={classes.modal}>
      <div className={classes.loaderContainer}>
        <Loader />
      </div>
    </Modal>
  );
};
