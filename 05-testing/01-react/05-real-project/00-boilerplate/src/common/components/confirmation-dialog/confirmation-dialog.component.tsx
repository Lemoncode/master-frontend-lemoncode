import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface LabelProps {
  closeButton: string;
  acceptButton: string;
}

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
  title: string | React.ReactNode;
  labels: LabelProps;
  children: React.ReactNode;
}

export const ConfirmationDialogComponent: React.FunctionComponent<Props> = (
  props
) => {
  const { isOpen, onAccept, onClose, title, labels, children } = props;

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          {labels.closeButton}
        </Button>
        <Button onClick={handleAccept} color="primary" variant="contained">
          {labels.acceptButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
