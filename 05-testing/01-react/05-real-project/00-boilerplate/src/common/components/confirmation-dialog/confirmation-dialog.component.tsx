import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
}

export const ConfirmationDialogComponent: React.FunctionComponent<Props> = props => {
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
